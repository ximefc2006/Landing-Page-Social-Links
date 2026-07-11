// ==========================================================================
// Main Interactivity
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize fade-in animations
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    // Simple delay to let the initial page render before animating
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // 2. Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Optional: Add intersection observer for scroll animations on other sections
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Example of adding class to elements to be animated on scroll
    const socialCards = document.querySelectorAll('.social-card');
    const qrCard = document.querySelector('.qr-card');
    
    socialCards.forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    if (qrCard) {
        qrCard.classList.add('fade-in-up');
        qrCard.style.transitionDelay = '0.3s';
        observer.observe(qrCard);
    }

    // 4. Image Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 4000; // 4 seconds per slide
    
    if (slides.length > 0) {
        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = index;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            let nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
        }
        function prevSlide() {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        }
        
        let sliderTimer = setInterval(nextSlide, slideInterval);
        
        // Navigation by clicking on the image container
        const sliderContainer = document.getElementById('sliderContainer');
        if (sliderContainer) {
            sliderContainer.addEventListener('click', () => {
                nextSlide();
                clearInterval(sliderTimer);
                sliderTimer = setInterval(nextSlide, slideInterval);
            });
            
            // Touch Swipe Support
            let touchStartX = 0;
            let touchEndX = 0;
            
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, {passive: true});
            
            function handleSwipe() {
                if (touchEndX < touchStartX - 30) {
                    // Swiped Left (Next)
                    nextSlide();
                    clearInterval(sliderTimer);
                    sliderTimer = setInterval(nextSlide, slideInterval);
                }
                if (touchEndX > touchStartX + 30) {
                    // Swiped Right (Prev)
                    prevSlide();
                    clearInterval(sliderTimer);
                    sliderTimer = setInterval(nextSlide, slideInterval);
                }
            }
        }
        
        // Make dots clickable
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                clearInterval(sliderTimer);
                sliderTimer = setInterval(nextSlide, slideInterval);
            });
        });
    }

    // 5. Interactive Map - Sucursales
    const mapContainer = document.getElementById('sucursalesMap');
    if (mapContainer) {
        const map = L.map('sucursalesMap', {
            scrollWheelZoom: false,
            doubleClickZoom: false,
            dragging: true,
            touchZoom: true,
            tap: true
        }).setView([19.4280, -99.1300], 16);

        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            attribution: '&copy; Google Maps',
            maxZoom: 20,
        }).addTo(map);

        // Custom red icon
        const redIcon = L.divIcon({
            className: 'custom-marker',
            html: '<i class="fa-solid fa-location-dot" style="font-size:2.2rem;color:#CE1126;filter:drop-shadow(0 3px 6px rgba(206,17,38,0.5));"></i>',
            iconSize: [30, 40],
            iconAnchor: [15, 40],
            popupAnchor: [0, -42]
        });

        // Active/Bigger icon
        const activeIcon = L.divIcon({
            className: 'custom-marker active',
            html: '<i class="fa-solid fa-location-dot" style="font-size:3.5rem;color:#CE1126;filter:drop-shadow(0 5px 12px rgba(206,17,38,0.8));"></i>',
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -52]
        });

        // Info Control
        const infoControl = L.control({ position: 'bottomright' });
        infoControl.onAdd = function () {
            this._div = L.DomUtil.create('div', 'store-info-control');
            this.update();
            return this._div;
        };
        infoControl.update = function (props) {
            if (props) {
                this._div.innerHTML = `
                    <h4>📍 ${props.name}</h4>
                    <p class="store-description-desktop">${props.description}</p>
                `;
                this._div.style.display = 'block';
            } else {
                this._div.innerHTML = '';
                this._div.style.display = 'none';
            }
        };
        infoControl.addTo(map);

        map.on('click', function() {
            infoControl.update(); // Hide info on map click
            if (window.allMarkersRef) {
                window.allMarkersRef.forEach(m => m.setIcon(redIcon));
            }
        });

        // All 12 branches
        const sucursales = [
            {
                name: 'Jesús María',
                address: 'And. Jesús María 136-1, Centro (Área 1), CDMX, C.P. 06020',
                coords: [19.42905, -99.12635],
                query: 'Andador+Jesus+Maria+136+Centro+Ciudad+de+Mexico+06020',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            },
            {
                name: 'Tabaqueros',
                address: 'Cll. Tabaqueros 7, Local, Centro, CDMX, C.P. 06020',
                coords: [19.42985, -99.12800],
                query: 'Calle+Tabaqueros+7+Centro+Ciudad+de+Mexico+06020',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            },
            {
                name: 'Julia y Julia B',
                address: 'Cll. de Venustiano Carranza 117, Centro, CDMX, C.P. 06000',
                coords: [19.42750, -99.13200],
                query: 'Venustiano+Carranza+117+Centro+Ciudad+de+Mexico+06000',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            },
            {
                name: 'Manzanares',
                address: 'Cjn. Manzanares 22, Centro, CDMX, C.P. 06020',
                coords: [19.42670, -99.12600],
                query: 'Callejon+Manzanares+22+Centro+Ciudad+de+Mexico+06020',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            },
            {
                name: 'Hector',
                address: 'Cll. del Correo Mayor 91, Centro, CDMX, C.P. 06020',
                coords: [19.42950, -99.13050],
                query: 'Correo+Mayor+91+Centro+Ciudad+de+Mexico+06020',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            },
            {
                name: 'MG',
                address: 'Cll. Correo Mayor 22-1, Moneda y Soledad, Centro, CDMX, C.P. 06060',
                coords: [19.43280, -99.12991],
                query: 'Correo+Mayor+22+Moneda+y+Soledad+Centro+Ciudad+de+Mexico+06060',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            },
            {
                name: 'Regina',
                address: 'Cll. Regina 88, Pino Suárez y 20 de Nov., Centro, CDMX, C.P. 06020',
                coords: [19.42550, -99.13400],
                query: 'Calle+Regina+88+Centro+Ciudad+de+Mexico+06020',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            },
            {
                name: 'Novedades Claudia',
                address: 'Del Correo Mayor 149, Col. Centro VII, CDMX, C.P. 06060',
                coords: [19.42700, -99.12950],
                query: 'Correo+Mayor+149+Colonia+Centro+Ciudad+de+Mexico+06060',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            },
            {
                name: 'Bonetería Richi 1, 2 y 3',
                address: 'Del Correo Mayor 127, Col. Centro VII, CDMX, C.P. 06060',
                coords: [19.42653, -99.13081],
                query: 'Correo+Mayor+127+Colonia+Centro+VII+Ciudad+de+Mexico+06060',
                description: 'Especialistas en bonetería, con extenso surtido y la mejor atención en ropa interior.'
            },
            {
                name: 'Zapata',
                address: 'C. Emiliano Zapata 57 Int. B, Col. Centro, Cuauhtémoc, CDMX, C.P. 06000',
                coords: [19.42480, -99.13700],
                query: 'Emiliano+Zapata+57+Colonia+Centro+Cuauhtemoc+CDMX+06000',
                description: 'Productos de temporada, follajes y decoración artificial; biombos y separadores decorativos; decoración para hogar, para fiestas y eventos; artículos navideños, de decoración y exhibición, de hallowen, llaveros y artículos de regalo'
            }
        ];

        const allMarkers = [];
        window.allMarkersRef = allMarkers;

        // List Control
        const listControl = L.control({ position: 'topleft' });
        listControl.onAdd = function () {
            this._div = L.DomUtil.create('div', 'store-list-control');
            let html = `
                <div class="store-list-header">
                    <h4>Nuestras Sucursales</h4>
                    <button class="hamburger-btn" onclick="this.parentElement.nextElementSibling.classList.toggle('show')"><i class="fa-solid fa-bars"></i></button>
                </div>
                <ul class="store-list-items">
            `;
            sucursales.forEach((s, index) => {
                html += `<li data-index="${index}">${s.name}</li>`;
            });
            html += '</ul>';
            this._div.innerHTML = html;
            L.DomEvent.disableClickPropagation(this._div);
            L.DomEvent.disableScrollPropagation(this._div);
            return this._div;
        };
        listControl.addTo(map);

        sucursales.forEach((s, index) => {
            const popupHTML = `
                <div class="popup-content">
                    <h3>📍 ${s.name}</h3>
                    <p>${s.address}</p>
                </div>
            `;
            const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

            const marker = L.marker(s.coords, { icon: redIcon })
                .addTo(map);
            
            s.marker = marker;
            allMarkers.push(marker);

            if (!isTouchDevice) {
                marker.bindPopup(popupHTML, { className: 'custom-popup' });
                // Desktop: show popup on hover
                marker.on('mouseover', function () { 
                    this.openPopup(); 
                    infoControl.update(s);
                });
                marker.on('mouseout', function () { 
                    if (this.options.icon === activeIcon) return; // Keep open if it's the active one from list
                    this.closePopup(); 
                    infoControl.update();
                });
            } else {
                // Mobile
                marker.on('click', function () {
                    allMarkers.forEach(m => m.setIcon(redIcon));
                    this.setIcon(activeIcon);
                    infoControl.update(s);
                    
                    // Simulated double tap
                    const now = Date.now();
                    if (this._lastClick && (now - this._lastClick) < 400) {
                        window.open('https://www.google.com/maps/search/?api=1&query=' + s.query, '_blank');
                    }
                    this._lastClick = now;
                });
            }

            // Double click: open Google Maps directly
            marker.on('dblclick', function (e) {
                L.DomEvent.stopPropagation(e);
                window.open('https://www.google.com/maps/search/?api=1&query=' + s.query, '_blank');
            });
        });

        // List item click events
        setTimeout(() => {
            const listItems = document.querySelectorAll('.store-list-control li');
            listItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Reset all markers
                    allMarkers.forEach(m => m.setIcon(redIcon));
                    
                    const idx = this.getAttribute('data-index');
                    const store = sucursales[idx];
                    
                    // Fly to location
                    map.flyTo(store.coords, 18, { duration: 1.5 });
                    
                    // Enlarge icon and show info
                    store.marker.setIcon(activeIcon);
                    
                    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
                    if (!isTouch) {
                        store.marker.openPopup();
                    }
                    infoControl.update(store);
                    
                    // Close the list on mobile
                    const storeList = document.querySelector('.store-list-items');
                    if (storeList) {
                        storeList.classList.remove('show');
                    }
                });
            });
        }, 100);

        // Fit map to show all markers
        if (allMarkers.length > 0) {
            const group = L.featureGroup(allMarkers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }
});
