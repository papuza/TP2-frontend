

//FUNCION PARA CARGAR LISTA DE MARKERS
const fetchItems = async () => {
  const $list = document.querySelector("#list-museos")
  $list.innerHTML = null
  try {
    const response = await fetch('http://localhost:3000/markers');
    const json = await response.json();
    json.forEach((marker) => { /*Creo toda la función que me trae los datos en el fetch*/

      const { _id, nombre, descripcion, type, lat, lng } = marker /*Hago el de-estructuring*/
      const item = ` 
        <div class="item-list-museo">
          <div class="item-list-content">
            <h3 class="item-list-title">${nombre}</h3>
            <p class="item-list-desc">${descripcion}</p>
            <div class="item-data">
              <p><b class="item-list-categ">Categoría: </b>${document.querySelector('#categoria option[value=' + type + ']').text}</p>
              <p><b class="item-list-lat">Latitud: </b>${lat}</p>
              <p><b class="item-list-long">Longitud: </b>${lng}</p>
            </div>
          </div>
          <div class="edit-borrar-btns">
            <div data-id=${_id} class="edit-item-btn">
              Editar
            </div>
            <div data-id=${_id} class="borrar-item-btn">
              Borrar
            </div>
          </div>
        </div>
              `
      $list.innerHTML += item; /*Esto es igual a '$list.innerHTML = $list.innerHTML + item;' Acá acumulo las entradas en el HTML interior de la lista*/

      const $editButtons = document.querySelectorAll('.edit-item-btn') // Selecciono cada elemento edit/delete
      $editButtons.forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          fillEditForm(el.dataset.id);
        })
      })
      const $deleteButtons = document.querySelectorAll('.borrar-item-btn')
      $deleteButtons.forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault(); // Evita el comportamiento default del elemento por ej un boton ser clikceable. 
          deleteItem(el.dataset.id);
        })
      })
    })
  } catch (error) {
    console.log(error)
  }
}

//FUNCION PARA ELIMINAR MARKER
const deleteItem = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/markers/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    fetchItems();
  } catch (error) {
    console.log(error)
  }
}


//FUNCION PARA EDITAR MARKER
const updateItem = async (id, data) => {
  try {
    const response = await fetch(`http://localhost:3000/markers/${id}`, {
      method: 'PUT',
      headers: new Headers({ 'content-type': 'application/x-www-form-urlencoded' }),
      body: data
    })
    const dataUpdated = await response.json()
    fetchItems();
  } catch (error) {
    console.log(error)
  }
}

//FUNCION PARA RELLENAR FORMULARIO DE EDIT
const fillEditForm = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/markers/${id}`)
    const data = await response.json();
    const formEditLayout = document.querySelector("#form-edit-item");
    formEditLayout.classList.remove("ocultar");
    const formEdit = document.querySelector("#formedit");
    const inputs = formEdit.elements;
    inputs["nombre"].value = data.nombre;
    inputs["lat"].value = data.lat;
    inputs["lng"].value = data.lng;
    inputs["descripcion"].value = data.descripcion;
    document.querySelector('#categoriaEdit option[value=' + data.type + ']').selected = 'selected'
    inputs["_id"].value = data._id

  } catch (error) {
    console.log(error)
  }
}

$(document).ready(function () {

  //ASIGNACION DE FUNCIONES A BOTONES GRALES
  $: closeBtn = document.querySelector('#close-form');
  closeBtn.addEventListener('click', closeForm);
  $: addBtn = document.querySelector('#agregar-item-btn');
  addBtn.addEventListener('click', openForm)
  $: closeEdit = document.querySelector('#close-edit-form');
  closeEdit.addEventListener('click', closeEditForm);
  function closeForm() {
    const formDisplay = document.querySelector("#form-add-item");
    formDisplay.classList.add("ocultar");
  }
  function openForm() {
    const formDisplay = document.querySelector("#form-add-item");

    formDisplay.classList.remove("ocultar");

  }
  function closeEditForm() {
    const formDisplay = document.querySelector("#form-edit-item");
    formDisplay.classList.add("ocultar");
  }

  //EJECUTO FUNCION PARA CARGAR LISTADO DE MARKERS
  fetchItems();

  //VALIDATE Y FUNCIONAMIENTO DE FORMULARIO "AGREGAR MUSEO"
  $("#form").validate({
    rules: {
      "nombre": {
        required: true
      },
      "lat": {
        required: true
      },
      "lng": {
        required: true
      },
      "descripcion": {
        required: true
      },
      "categoria": {
        required: true
      }
    },

    messages: {
      "nombre": "Ingresa un nombre",
      "lat": "Ingresa la latitud",
      "lng": "Ingresa la longitud",
      "descripcion": "Ingresa la descripcion",
      "categoria": "Elija una categoria"
    },

    submitHandler: function () {
      $.ajax({
        url: form.action,
        type: form.method,
        data: $(form).serialize(),
        success: function (response) {
          fetchItems();
        }
      })
    }
  });

  //VALIDATE Y FUNCIONAMIENTO DE FORMULARIO "EDITAR MUSEO"
  $("#formedit").validate({
    rules: {
      "nombre": {
        required: true
      },
      "lat": {
        required: true
      },
      "lng": {
        required: true
      },
      "descripcion": {
        required: true
      },
      "categoria": {
        required: true
      }
    },

    messages: {
      "nombre": "Ingresa un nombre",
      "lat": "Ingresa la latitud",
      "lng": "Ingresa la longitud",
      "descripcion": "Ingresa la descripcion",
      "categoria": "Elija una categoria"
    },

    submitHandler: function () {
      const id = document.querySelector(".id_edit").value;
      updateItem(id, $(formedit).serialize());
    }
  });
})
