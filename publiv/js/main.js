const main = document.getElementById("main");
const userStatus = document.getElementById("user-status");
const contextMenu = document.getElementById("context-menu");
const name = document.getElementById("name").innerHTML;
const lastName = document.getElementById("last-name").innerHTML;
const email = document.getElementById("user-name").innerHTML;


let userId = 0;
let isAdmin = false;

function admin() {
  if (isAdmin) {
    return "true";
  } else {
    return "none";
  }
}

async function userType(tipo, id) {
  const userType = document.getElementById("user-type");
  if ((await tipo) == "true" || (await tipo) == true) {
    userType.innerHTML = `usuario tipo: Administrador`;
    isAdmin = true;
    userId = await id;
    updateUser(await id);
  } else {
    userType.innerHTML = `usuario tipo: Cliente`;
    userId = await id;
    updateUser(await id);
  }
}

async function updateUser(id) {
  const url = "api/usuarios/login";
  const payload = {
    id: id,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  await fetch(url, options).then((response) => console.log(response.status));
}


async function getProducts() {
  let productos = await fetch("/api/productos");
  let data = await productos.json();
  return data;
}

async function getProduct(id) {
  let producto = await fetch(`/api/productos/${id}`);
  let data = await producto.json();
  return data;
}


async function getCart(id) {
  let cart = await fetch(`api/carrito/${id}/productos/`);
  let data = await cart.json();
  return data;
}


async function mainBody() {
  Toastify({
    text: `Usuario (${name}) activo`,
    className: "info",
    position: "right",
    gravity: "bottom",
    duration: 5000,
    close: true,
    style: {
      color: "white",
      background: "linear-gradient(45deg, cornflowerblue, darkslateblue)",
    },
  }).showToast();

  const productos = await getProducts();
  main.innerHTML = "";
  contextMenu.innerHTML = "";
  if (isAdmin) {
    const cartOptions = `
        <p class="menu-name">menú administrador de ${name} ${lastName} </p>
        <input class="btn" type="button" onclick="crearProducto()" name="boton" value="+ producto">
        `;
    contextMenu.innerHTML = cartOptions;
  }
  productos.forEach((producto) => {
    const addValues = {id : producto.id, nombre: producto.nombre}
    document.createElement("div");
    const contenido = `
<div class="card-container">
    <div class="image-container"><img class="image" src="${producto.thumbnail}" alt=""></div>
    <div class="detail-container">
        <p class="descripcion-titulo">${producto.nombre}</p>
        <p class="detalle-card"><strong>-tipo:</strong> ${producto.codigo}<br>
        <strong>-descripcion:</strong><br>${producto.detalle}<br>
        <strong>-precio:</strong> $:${producto.precio}-<br>
        <strong>-stock:</strong> ${producto.stock}
        </p>
    </div>
    <div class="form">
        <input class="input-number" id="cant${producto.id}" onkeydown="return false" step="1" min="1" max="${producto.stock}" value="1" type="number" name="cantidad">
        <input class="btn" type="submit" onclick="addToCart(${producto.id},'${producto.nombre}')", name="boton" value="agregar al carrito">
    </div>
    <input class="btn" type="button" onclick="detallarProducto(${producto.id})" name="boton" value="ver producto">
</div>
`;
    main.innerHTML += contenido;
  });
}

async function crearProducto() {
  const contenido = `
    <div class="card-container">
    <label for="nombre">nombre</label>
    <input id="nombre" class="input" type="text" name="nombre" >
    <label for="precio">precio</label>
    <input id="precio" class="input" type="number" name="precio"  step="0.1" min="0.1">
    <label for="codigo">codigo</label>
    <input id="codigo" class="input" type="text" name="codigo" >
    <label for="thumbnail">imagen (url)</label>
    <input id="thumbnail" class="input" type="text" name="thumbnail" >
    <label for="stock">stock</label>
    <input id="stock" class="input" type="number" name="precio"  onkeydown="return false" step="1" min="1">
    <label for="detalle">detalle</label>
    <input id="detalle" class="input" type="text" name="detalle" >
    <input class="btn" type="button" onclick="createProduct()" name="boton" value="confirmar">
    </div>
    `;
  main.innerHTML = contenido;
}

async function createProduct() {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const codigo = document.getElementById("codigo").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const stock = document.getElementById("stock").value;
  const detalle = document.getElementById("detalle").value;
  const url = "api/productos/";
  const payload = {
    nombre: nombre,
    precio: precio,
    codigo: codigo,
    thumbnail: thumbnail,
    stock: stock,
    detalle: detalle,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  if (!nombre) {
    alert("Alerta: no se ha especificado ningún nombre");
  } else if (!precio) {
    alert("Alerta: no se ha especificado ningún precio");
  } else if (!codigo) {
    alert("Alerta: no se ha especificado ningún codigo");
  } else if (!thumbnail) {
    alert("Alerta: no se ha agregado ninguna imagen");
  } else if (!stock) {
    alert("Alerta: no ha especificado el stock");
  } else if (!detalle) {
    alert("Alerta: no ha detallado el producto");
  } else {
    sendData(nombre);
  }
  async function sendData(nombre) {
    Swal.fire({
      title: "Agregar Producto Nuevo",
      text: `Agregar ${nombre} al inventario?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "confirmar",
      cancelButtonText: "cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(url, options)
          .then((response) => console.log(response.status))
          .catch((err) => console.log(err));
        Swal.fire({
          title: "Exito!",
          text: `El producto ${nombre} ha sido creado satisfactoriamente`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ir al Home",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      }
    });
  }
}

async function actualizarProducto(id) {
  const producto = await getProduct(id);
  const contenido = `
    <div class="card-container">
    <label for="nombre">nombre</label>
    <input id="nombre" class="input" type="text" name="nombre" value="${producto.nombre}">
    <label for="precio">precio</label>
    <input id="precio" class="input" type="number" name="precio" value="${producto.precio}" step="0.1" min="0.1">
    <label for="codigo">codigo</label>
    <input id="codigo" class="input" type="text" name="codigo" value="${producto.codigo}">
    <label for="thumbnail">imagen (url)</label>
    <input id="thumbnail" class="input" type="text" name="thumbnail" value="${producto.thumbnail}">
    <label for="stock">stock</label>
    <input id="stock" class="input" type="number" name="precio" value="${producto.stock}" onkeydown="return false" step="1" min="1">
    <label for="detalle">detalle</label>
    <input id="detalle" class="input" type="text" name="detalle" value="${producto.detalle}">
    <input class="btn" type="button" onclick="updateProduct(${producto.id})" name="boton" value="confirmar">
    </div>
    `;
  main.innerHTML = contenido;
}

async function updateProduct(id) {
  const url = `/api/productos/${id}`;
  const nombre = document.getElementById("nombre").value;
  const payload = {
    nombre: document.getElementById("nombre").value,
    precio: document.getElementById("precio").value,
    codigo: document.getElementById("codigo").value,
    thumbnail: document.getElementById("thumbnail").value,
    stock: document.getElementById("stock").value,
    detalle: document.getElementById("detalle").value,
  };
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  Swal.fire({
    title: "Actualizar Producto",
    text: `Actualizar los datos de ${nombre}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "confirmar",
    cancelButtonText: "cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url, options)
        .then((response) => console.log(response.status))
        .catch((err) => console.log(err));
      Swal.fire({
        title: "Exito!",
        text: `El producto ${nombre} ha sido actualizado satisfactoriamente`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ir al Home",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/";
        }
      });
    }
  });
}

async function detallarProducto(id) {
  const producto = await getProduct(id);
  const contenido = `
<div class="card-container">
    <div class="image-container"><img class="image" src="${
      producto.thumbnail
    }" alt=""></div>
    <div class="detail-container">
        <p class="descripcion-titulo">${producto.nombre}</p>
        <p class="detalle-card"><strong>-tipo:</strong> ${producto.codigo}<br>
        <strong>-descripcion:</strong><br>${producto.detalle}<br>
        <strong>-precio:</strong> $:${producto.precio}-<br>
        <strong>-stock:</strong> ${producto.stock}
        </p>
    </div>
    <div class="form">
        <input class="input-number" id="cant${
          producto.id
        }" onkeydown="return false" step="1" min="1" max="${
    producto.stock
  }" value="1" type="number" name="cantidad">
        <input class="btn" type="submit" onclick="addToCart(${
          producto.id
        }, '${producto.nombre}')" name="boton" value="agregar al carrito">
    </div>
    <div class="form">
    <input style="display:${admin()}" class="btn" type="button" onclick="actualizarProducto(${
    producto.id
  })" name="boton" value="editar">
    <input style="display:${admin()}" class="btn" type="button" onclick="deleteProduct(${
    producto.id
  })" name="boton" value="eliminar">
    </div>     
</div>
`;
  main.innerHTML = contenido;
}

async function deleteProduct(id) {
  const url = `api/productos/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  Swal.fire({
    title: "Eliminar Producto",
    text: `Eliminar este producto del inventario?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "confirmar",
    cancelButtonText: "cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url, options)
        .then((response) => console.log(response.status))
        .catch((err) => console.log(err));
      Swal.fire({
        title: "Exito!",
        text: `El producto ha sido eliminado satisfactoriamente`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ir al Home",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/";
        }
      });
    }
  });
}


async function createCart(id) {
  const url = `api/carrito/`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(url, options)
    .then((response) => console.log(response.status))
    .then(alert(`El carrito ${id} ha sido creado satisfactoriamente`));
  seeCart();
}

async function addToCart(id, nombre) {
  const url = `api/carrito/${id}/productos`;
  const payload = {
    cantidad: parseInt(document.getElementById(`cant${id}`).value),
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  if (userId == 0) {
    console.log("no hay ningun usuario logueado");
  } else {
    await fetch(url, options)
      .then((response) => console.log(response.status))
      .catch((err) => console.log(err));
    Toastify({
      text: `${nombre} añadido al carrito`,
      className: "info",
      position: "right",
      gravity: "bottom",
      duration: 5000,
      close: true,
      style: {
        color: "white",
        background: "linear-gradient(45deg, cornflowerblue, darkslateblue)",
      },
    }).showToast();
  }
}

async function purchase() {
  const cart = await getCart(userId);
  const products = [];
  cart.forEach((producto) => {
    const listaItems = `-item: ${producto.nombre}, cant: ${producto.stock}\n`;
    products.push(listaItems);
  });
  const mail = {
    asunto: `nuevo pedido de ${name} ${lastName} - (${email})`,
    mensaje: `
        ${name} ${lastName}. Email: ${email}\n
        solicita los siguientes productos:\n
        ${products}
        -mensaje automatizado de alerta.
        `,
    mensajeSms: `${name} ${lastName}. Su pedido ha sido recibido y se encuentra en proceso. \n
        su pedido es: \n
        ${products}.`,
  };
  const url = "/purchase";
  const payload = mail;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  Swal.fire({
    title: "Confirmar Compra",
    text: `Está a punto de Confirmar la compra`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "confirmar",
    cancelButtonText: "cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url, options)
        .then((response) => console.log(response.status))
        .catch((err) => console.log(err));
      Swal.fire({
        title: "Exito!",
        text: `La compra se ha confirmado`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ir al Home",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/";
        }
      });
    }
  });
}

async function seeCart() {
  if (userId == 0) {
    alert("no hay ningun usuario logueado");
  } else {
    const cart = await getCart(userId);
    const cartOptions = `
                <p class="menu-name">carrito de ${name}</p>
                <input class="btn" type="button" onclick="seeCart()" name="boton" value="refresh">
                <input class="btn" type="button" onclick="purchase()" name="boton" value="confirmar compra">
                `;
    contextMenu.innerHTML = cartOptions;
    if (cart.error) {
      const contenido = `
            <div class="no-cart">
            <h2 class="h2">Al parecer este carrito no existe<h3>
            <h3 class="h3">desea crear uno?<h4>
            <input class="btn" type="button" onclick="createCart(${userId})" name="boton" value="crear carrito">
            </div>
            `;
      main.innerHTML = contenido;
    } else if (!cart.length) {
      const contenido = `
            <div class="no-cart">
            <h2 class="h2">El carrito se encuentra vacío<h3>
            <h3 class="h3">agrega productos desde el home<h4>
            <input class="btn" type="button" value="Ir al Home" onClick="mainBody()">
            </div>
            `;
      main.innerHTML = contenido;
    } else {
      main.innerHTML = "";
      contextMenu.innerHTML = cartOptions;
      cart.forEach((producto) => {
        document.createElement("div");
        const contenido = `
                <div class="card-container">
                    <div class="image-container"><img class="image" src="${producto.thumbnail}" alt=""></div>
                    <div class="detail-container">
                        <p class="descripcion-titulo">${producto.nombre}</p>
                        <p class="detalle-card"><strong>-tipo:</strong> ${producto.codigo}<br>
                        <strong>-descripcion:</strong><br>${producto.detalle}<br>
                        <strong>-precio:</strong> $:${producto.precio}-<br>
                        <strong>-stock:</strong> ${producto.stock}
                        </p>
                    </div>
                    <input class="btn" type="button" onclick="quitarDelCarrito(${producto.id}, '${producto.nombre}')" name="boton" value="quitar del carrito">
                </div>
                `;
        main.innerHTML += contenido;
      });
    }
  }
}

async function quitarDelCarrito(id, nombre) {
  const url = `api/carrito/${userId}/productos/${id}/`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(url, options)
    .then((response) => console.log(response.status))
    .catch((err) => console.log(err));
  Toastify({
    text: `${nombre} removido del carrito`,
    className: "info",
    position: "right",
    gravity: "bottom",
    duration: 5000,
    close: true,
    style: {
      color: "white",
      background: "linear-gradient(45deg, cornflowerblue, darkslateblue)",
    },
  }).showToast();
  seeCart();
}

async function deleteCart(id) {
  const url = `api/carrito/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(url, options)
    .then((response) => console.log(response.status))
    .then(alert(`El carrito del usuario ha sido eliminado también`));
}
mainBody();