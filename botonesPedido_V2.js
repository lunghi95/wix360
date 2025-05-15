// botonesPedido.js
(function(){
  const CREDENTIALS = {
    alexis:  '2706',
    claudio: '2105',
    nanci:   '1607',
    axel:    '0209',
    luciano: '2025',
    mariano: '4444',
    hugo:    '2025',
    hernan:  '2025',
    tony:    '2112'
  };

  function inicializarBotonesPedido() {
    const target = document.getElementById("spinnerContainer");
    if (!target) return;

    // Contenedor principal
    const container = document.createElement("div");
    container.id = "pedido-buttons";
    container.style.cssText = `position: absolute; top: 20px; left: 20px; z-index: 20; display: flex; flex-direction: column; gap: 10px;`;

    // 1) Botón Login
    const btnLogin = document.createElement("button");
    btnLogin.id = "btnLoginPedido";
    btnLogin.textContent = "Ingresar Viajante";
    btnLogin.style.cssText = `padding: 8px 6px; font-size:14px; border:none; border-radius:4px; background:#6c757d; color:#fff; cursor:pointer;`;
    btnLogin.onclick = () => {
      const user = prompt("Usuario:");
      const pass = prompt("Clave:");
      if (CREDENTIALS[user] === pass) {
        // Login válido
        localStorage.setItem("isVendedor", "true");
        localStorage.setItem("vendedorUser", user);
        showAfterLogin(user);
      } else {
        alert("Credenciales incorrectas");
      }
    };

    // 2) Botón “📝 Pedido”
    const btnPedido = document.createElement("button");
    btnPedido.id = "btnPedido";
    btnPedido.textContent = "📝 Pedido";
    btnPedido.style.cssText = 'padding:8px 10px;font-size:14px;border-radius:5px;border:none;cursor:pointer;background:#007bff;color:#fff;display:none';
    btnPedido.onclick = () => {
      if (!clienteData) abrirClienteModal();
      else abrirDetalleModal();
    };

    // 3) Botón “➕ Agregar Artículo”
    const btnAgregar = document.createElement("button");
    btnAgregar.id = "btnAgregarArticulo";
    btnAgregar.textContent = "➕ Agregar Artículo";
    btnAgregar.style.cssText = 'padding:8px 6px;font-size:14px;border-radius:5px;border:none;cursor:pointer;background:#28a745;color:#fff;display:none';
    btnAgregar.onclick = () => {
      const idx = getCurrentProductIndex();
      if (idx) agregarLineaDesdeVisor(idx);
      else alert("❌ No hay producto activo.");
    };

    // 4) Botón “Salir”
    const btnLogout = document.createElement("button");
    btnLogout.id = "btnLogoutPedido";
    btnLogout.textContent = "Salir";
    btnLogout.style.cssText = 'padding:8px 6px;font-size:14px;border-radius:5px;border:none;cursor:pointer;background:#dc3545;color:#fff;display:none';
    btnLogout.onclick = () => {
      localStorage.removeItem("isVendedor");
      localStorage.removeItem("vendedorUser");
      // restauramos UI
      btnPedido.style.display = "none";
      btnAgregar.style.display = "none";
      btnLogout.style.display = "none";
      btnLogin.style.display = "block";
      alert("Has salido de la sesión.");
    };

    // Añadimos todo al container
    container.append(btnLogin, btnPedido, btnAgregar, btnLogout);
    target.appendChild(container);

    // Helper para mostrar tras login
    function showAfterLogin(user) {
      btnLogin.style.display  = "none";
      btnPedido.style.display = "block";
      btnLogout.style.display = "block";
      // opcional: mostrar un saludo
      console.log(`✅ Viajante '${user}' logueado.`);
    }

    // Al cargar la página, verificamos estado
    const saved = localStorage.getItem("isVendedor") === "true";
    const user   = localStorage.getItem("vendedorUser");
    if (saved && user) {
      showAfterLogin(user);
    }
  }

  // estilo base para los botones
  const buttonStyle = `
    padding: 6px 12px; font-size:14px; border:none;
    border-radius:4px; background:#007bff; color:#fff; cursor:pointer;
    margin-bottom:4px;
  `;

  window.addEventListener("load", inicializarBotonesPedido);
})();
