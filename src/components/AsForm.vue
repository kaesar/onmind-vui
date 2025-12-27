<script setup>
import { ref, computed, onMounted } from 'vue'
import AsInput from './AsInput.vue'
import AsText from './AsText.vue'
import AsSelect from './AsSelect.vue'
import AsCheck from './AsCheck.vue'
import AsSwitch from './AsSwitch.vue'
import AsRadio from './AsRadio.vue'
import AsDate from './AsDate.vue'
import AsTime from './AsTime.vue'
import AsComplete from './AsComplete.vue'
import AsButton from './AsButton.vue'

const props = defineProps({
  schema: { type: Object, default: () => ({}) },
  theme: { type: String, default: '' },
  successMessage: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  hideTitle: { type: Boolean, default: false }
})

const emit = defineEmits(['form-submit', 'form-cancel', 'field-change'])

const formData = ref({})
const errors = ref({})
const cancelled = ref(false)

const allFields = computed(() => {
  const fields = []
  if (props.schema.fields) {
    fields.push(...props.schema.fields)
  }
  if (props.schema.sections) {
    props.schema.sections.forEach(section => {
      if (section.fields) {
        fields.push(...section.fields)
      }
    })
  }
  return fields
})

function validateField(value, rules) {
  if (!rules) return { valid: true }
  
  for (const rule of rules) {
    const [ruleName, ruleParam] = rule.split(':')
    
    switch (ruleName) {
      case 'required':
        if (!value || value.toString().trim().length === 0) {
          return { valid: false, message: 'This field is required' }
        }
        break
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return { valid: false, message: 'Please enter a valid email address' }
        }
        break
      case 'min':
        if (value && value.toString().length < parseInt(ruleParam)) {
          return { valid: false, message: `Minimum ${ruleParam} characters required` }
        }
        break
      case 'max':
        if (value && value.toString().length > parseInt(ruleParam)) {
          return { valid: false, message: `Maximum ${ruleParam} characters allowed` }
        }
        break
    }
  }
  
  return { valid: true }
}

function handleFieldChange(fieldName, value, validation) {
  formData.value = { ...formData.value, [fieldName]: value }
  
  // Clear previous error
  if (errors.value[fieldName]) {
    const newErrors = { ...errors.value }
    delete newErrors[fieldName]
    errors.value = newErrors
  }
  
  // Validate field if validation rules exist
  if (validation) {
    const result = validateField(value, validation)
    if (!result.valid) {
      errors.value = { ...errors.value, [fieldName]: result.message }
    }
  }
  
  emit('field-change', { fieldName, value, formData: formData.value })
}

function handleSubmit() {
  // Validate all fields
  let hasErrors = false
  const newErrors = {}
  
  allFields.value.forEach(field => {
    if (field.validation) {
      const value = formData.value[field.name] || ''
      const result = validateField(value, field.validation)
      if (!result.valid) {
        newErrors[field.name] = result.message
        hasErrors = true
      }
    }
  })
  
  errors.value = newErrors
  
  if (!hasErrors) {
    emit('form-submit', { formData: formData.value })
  }
}

function handleCancel() {
  cancelled.value = true
  emit('form-cancel')
}

function formatOptions(options) {
  if (!options) return ''
  return options.map(opt => `label=${opt.label},value=${opt.value}`).join(';')
}

// Public API methods
function getFormData() {
  return { ...formData.value }
}

function setFormData(data) {
  formData.value = { ...data }
}

function clearErrors() {
  errors.value = {}
}

function validate() {
  handleSubmit()
  return Object.keys(errors.value).length === 0
}

defineExpose({
  getFormData,
  setFormData,
  clearErrors,
  validate
})

onMounted(() => {
  // Initialize form data with default values
  allFields.value.forEach(field => {
    if (field.value !== undefined) {
      formData.value[field.name] = field.value
    }
  })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 v-if="schema.title && !hideTitle" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
      {{ schema.title }}
    </h2>
    
    <!-- Sections -->
    <div v-if="schema.sections" class="space-y-6">
      <div v-for="section in schema.sections" :key="section.title" class="space-y-3">
        <h3 v-if="section.title" class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          {{ section.title }}
        </h3>
        <div v-for="field in section.fields" :key="field.name" class="space-y-1">
          <!-- Dynamic field rendering -->
          <AsInput
            v-if="['text', 'email', 'password', 'number'].includes(field.type)"
            :label="field.label"
            :kind="field.type"
            :value="formData[field.name] || field.value || ''"
            :placeholder="field.placeholder"
            :readonly="field.readonly"
            :disabled="field.disabled"
            :theme="theme"
            @value-changed="e => handleFieldChange(field.name, e.detail?.value || e, field.validation)"
          />
          
          <AsText
            v-else-if="field.type === 'textarea'"
            :label="field.label"
            :value="formData[field.name] || field.value || ''"
            :placeholder="field.placeholder"
            :rows="field.rows || 3"
            :readonly="field.readonly"
            :disabled="field.disabled"
            :theme="theme"
            @value-changed="e => handleFieldChange(field.name, e.detail?.value || e, field.validation)"
          />
          
          <AsSelect
            v-else-if="field.type === 'select'"
            :label="field.label"
            :value="formData[field.name] || field.value || ''"
            :options="formatOptions(field.options)"
            :disabled="field.disabled"
            :theme="theme"
            @value-changed="e => handleFieldChange(field.name, e.detail?.value || e, field.validation)"
          />
          
          <AsCheck
            v-else-if="field.type === 'checkbox'"
            :label="field.label"
            :checked="formData[field.name] || field.value || false"
            :disabled="field.disabled"
            :theme="theme"
            @checked-changed="e => handleFieldChange(field.name, e.detail?.value || e, field.validation)"
          />
          
          <AsSwitch
            v-else-if="field.type === 'switch'"
            :label="field.label"
            :checked="formData[field.name] || field.value || false"
            :disabled="field.disabled"
            :theme="theme"
            @checked-changed="e => handleFieldChange(field.name, e.detail?.value || e, field.validation)"
          />
          
          <div v-if="errors[field.name]" class="text-red-600 dark:text-red-400 text-sm">
            {{ errors[field.name] }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Direct fields (no sections) -->
    <div v-else-if="schema.fields" class="space-y-3">
      <div v-for="field in schema.fields" :key="field.name" class="space-y-1">
        <!-- Same field rendering logic as above -->
        <div v-if="errors[field.name]" class="text-red-600 dark:text-red-400 text-sm">
          {{ errors[field.name] }}
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div v-if="!schema.skipActions" class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      <AsButton
        v-if="!schema.hideCancelButton"
        :label="schema.cancelLabel || 'Cancel'"
        variant="secondary"
        :theme="theme"
        @button-tap="handleCancel"
      />
      <AsButton
        :label="schema.submitLabel || 'Save'"
        variant="primary"
        :disabled="cancelled"
        :theme="theme"
        @button-tap="handleSubmit"
      />
    </div>
  </div>
</template>