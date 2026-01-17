/* 
   File: script.js
   Descrizione: Logica interattiva completa per TerraByte Coffee (Versione Definitiva)
   Autore: Tuo Nome
*/

document.addEventListener('DOMContentLoaded', () => {
    console.log('System.Init(): TerraByte Coffee modules loaded.');

    // ==========================================
    // 1. GESTIONE CARRELLO (CORE LOGIC)
    // ==========================================
    
    // Variabili Globali Carrello
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Elementi DOM Carrello
    const cartOverlay = document.getElementById('cart-overlay');
    const cartPanel = document.getElementById('cart-panel');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountBadge = document.getElementById('cart-count');
    const emptyMsg = document.getElementById('empty-cart-msg');
    
    // Elementi Trigger
    const openCartBtns = document.querySelectorAll('#open-cart-btn'); // Supporta più bottoni
    const closeCartBtn = document.getElementById('close-cart');

    // --- FUNZIONI CARRELLO ---

    // Aggiorna UI Carrello (Lista e Totale)
    function updateCartUI() {
        if (!cartItemsContainer) return; 

        cartItemsContainer.innerHTML = ''; 

        if (cart.length === 0) {
            if (emptyMsg) {
                cartItemsContainer.appendChild(emptyMsg);
                emptyMsg.style.display = 'block';
            }
            if (cartCountBadge) cartCountBadge.classList.add('hidden');
        } else {
            if (emptyMsg) emptyMsg.style.display = 'none';
            if (cartCountBadge) {
                cartCountBadge.classList.remove('hidden');
                cartCountBadge.innerText = cart.length;
            }

            // Genera righe prodotti
            cart.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'flex justify-between items-center bg-surface p-3 rounded border border-gray-700 animate-fade-in-right';
                itemEl.innerHTML = `
                    <div>
                        <h4 class="font-bold text-sm text-offwhite">${item.name}</h4>
                        <div class="text-xs text-gray-400 font-mono">€ ${item.price.toFixed(2)}</div>
                    </div>
                    <button class="text-red-400 hover:text-red-300 text-xs font-mono remove-btn transition-colors p-2" data-index="${index}">
                        [DEL]
                    </button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });

            // Listener per bottoni Rimuovi
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    removeFromCart(idx);
                });
            });
        }

        // Calcolo Totale
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        if (cartTotalElement) cartTotalElement.innerText = `€ ${total.toFixed(2)}`;

        // Salvataggio
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Aggiungi
    function addToCart(name, price) {
        cart.push({ name, price });
        updateCartUI();
        openCart(); // Feedback immediato
    }

    // Rimuovi
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    // Apri Pannello
    function openCart() {
        if (cartOverlay && cartPanel) {
            cartOverlay.classList.remove('hidden');
            setTimeout(() => {
                cartPanel.classList.remove('translate-x-full');
            }, 10);
        }
    }

    // Chiudi Pannello
    function closeCart() {
        if (cartOverlay && cartPanel) {
            cartPanel.classList.add('translate-x-full');
            setTimeout(() => {
                cartOverlay.classList.add('hidden');
            }, 300);
        }
    }

    // --- EVENT LISTENERS CARRELLO ---
    
    openCartBtns.forEach(btn => btn.addEventListener('click', openCart));
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Inizializza UI all'avvio
    updateCartUI();


    // ==========================================
    // 2. GESTIONE SHOP & ADD-TO-CART
    // ==========================================
    
    // Metodo A: Bottoni "Add_to_Cart()" nella pagina Shop
    const shopButtons = document.querySelectorAll('.add-to-cart-trigger');
    shopButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            if (name && !isNaN(price)) {
                addToCart(name, price);
                
                // Animazione bottone
                const originalContent = this.innerHTML;
                this.innerHTML = "<span>✓</span> Added!";
                this.classList.add('bg-accent', 'text-primary');
                setTimeout(() => {
                    this.innerHTML = originalContent;
                    this.classList.remove('bg-accent', 'text-primary');
                }, 1000);
            }
        });
    });


    // ==========================================
    // 3. STRIPE CHECKOUT (REDIRECT REALE)
    // ==========================================
    
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            
            // 1. Controllo carrello vuoto
            if(cart.length === 0) {
                alert('System Error: Cart is [NULL]. Add items to deploy.');
                return;
            }

            // 2. Feedback Visivo "Loading"
            const originalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = 'Handshaking with Stripe... <span class="animate-spin inline-block">⏳</span>';
            checkoutBtn.classList.add('opacity-75', 'cursor-not-allowed');
            checkoutBtn.disabled = true;

            // 3. Esecuzione Redirect al tuo Link Stripe
            setTimeout(() => {
                // Opzionale: Puliamo il carrello prima di andare via
                // (Assumendo che l'utente compri. Se vuoi che rimanga, togli questa riga)
                localStorage.removeItem('cart'); 
                
                // IL TUO LINK DI TEST REALE
                window.location.href = 'https://buy.stripe.com/test_9B600i1EkdL32SJ8mm1RC00'; 
                
            }, 1500); 
        });
    }


    // ==========================================
    // 4. UI EFFECTS & NAVIGATION
    // ==========================================

    // A. Typewriter Effect (Home)
    const heroTitle = document.querySelector('.typewriter-effect');
    if (heroTitle) {
        const text = heroTitle.getAttribute('data-text');
        let i = 0;
        heroTitle.textContent = ''; 
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80); 
            }
        }
        setTimeout(typeWriter, 500);
    }

    // B. Navbar Active State -> RIMOSSO (Navbar neutra)

    // C. Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

}); // END DOMContentLoaded
