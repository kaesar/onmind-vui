<script setup>
import { ref } from 'vue'
import AsButton from './components/AsButton.vue'
import AsInput from './components/AsInput.vue'
import AsCheck from './components/AsCheck.vue'
import AsSwitch from './components/AsSwitch.vue'
import AsSelect from './components/AsSelect.vue'
import AsDate from './components/AsDate.vue'
import AsTime from './components/AsTime.vue'
import AsText from './components/AsText.vue'
import AsRadio from './components/AsRadio.vue'
import AsComplete from './components/AsComplete.vue'
import AsBox from './components/AsBox.vue'
import AsConfirm from './components/AsConfirm.vue'
import AsImage from './components/AsImage.vue'
import AsVideo from './components/AsVideo.vue'
import AsEmbed from './components/AsEmbed.vue'
import AsDatagrid from './components/AsDatagrid.vue'
import AsEvent from './components/AsEvent.vue'
import AsModal from './components/AsModal.vue'
import AsPopup from './components/AsPopup.vue'
import AsUpload from './components/AsUpload.vue'
import AsForm from './components/AsForm.vue'

const modal = ref(null)
const popup = ref(null)

function onRowSelect(event) {
  console.log('Row selected:', event.row)
}

function onRowAction(event) {
  console.log('Row action:', event.row)
  const mouseEvent = event.event || { clientX: 100, clientY: 100 }
  popup.value?.show(mouseEvent.clientX, mouseEvent.clientY)
}

function onEventTrigger(data) {
  console.log('Event triggered:', data)
  modal.value?.show()
}

function onFilesSelected(data) {
  console.log('Files selected:', data.files)
}

function onPopupSelect(data) {
  console.log('Popup option selected:', data)
  if (data.value === 'delete') {
    // Emit delete event or handle delete action
    console.log('Delete action triggered')
  }
}

const formSchema = {
  title: 'User Registration',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'First Name',
          required: true,
          validation: ['required', 'min:2']
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          validation: ['required', 'email']
        }
      ]
    }
  ]
}

function onFormSubmit(data) {
  console.log('Form submitted:', data)
  modal.value?.hide()
}

function onFormCancel() {
  console.log('Form cancelled')
  modal.value?.hide()
}
</script>

<template>
  <div class="p-5 flex flex-col gap-5">
    <div>
      <h3 class="text-lg font-semibold mb-2">Button:</h3>
      <AsButton label="Click me!" message="Ok" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Input:</h3>
      <AsInput />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Date:</h3>
      <AsDate placeholder="Select date" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Time:</h3>
      <AsTime placeholder="Select time" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Checkbox:</h3>
      <AsCheck />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Switch:</h3>
      <AsSwitch />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Select:</h3>
      <AsSelect label="Selecciona" options="label=JavaScript,value=js;label=TypeScript,value=ts;label=Python,value=py;label=Java,value=java" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Textarea:</h3>
      <AsText />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Radio:</h3>
      <AsRadio />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">AutoComplete:</h3>
      <AsComplete label="Buscar lenguaje" options="label=JavaScript,value=js;label=TypeScript,value=ts;label=Python,value=py;label=Java,value=java" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Event:</h3>
      <AsEvent label="Open Modal" value="Click to open" event="custom-event" @custom-event="onEventTrigger" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Upload:</h3>
      <AsUpload label="Upload files" accept="image/*" multiple @files-selected="onFilesSelected" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Box:</h3>
      <AsBox dim="true">
        <p>Content inside box</p>
        <div>
          <h3 class="text-lg font-semibold mb-2">Confirm:</h3>
          <AsConfirm label="Delete" message="Are you sure you want to delete this item?" />
        </div>
      </AsBox>
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Image:</h3>
      <AsImage url="https://placehold.co/300x200" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Video:</h3>
      <AsVideo url="https://www.youtube.com/embed/dQw4w9WgXcQ" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Embed:</h3>
      <AsEmbed url="https://www.example.com" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">DataGrid:</h3>
      <AsDatagrid theme="light" selectable filterable pageable actionable @row-select="onRowSelect" @row-action="onRowAction" />
    </div>
  </div>

  <!-- Modal with Form -->
  <AsModal ref="modal" title="User Form">
    <AsForm :schema="formSchema" @form-submit="onFormSubmit" @form-cancel="onFormCancel" />
  </AsModal>

  <!-- Popup Menu -->
  <AsPopup ref="popup" options="label=Edit,value=edit;label=Duplicate,value=duplicate;label=Delete,value=delete" @option-select="onPopupSelect" />
</template>
