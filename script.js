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

        // Info Control
        const infoControl = L.control({ position: 'bottomright' });
        infoControl.onAdd = function () {
            this._div = L.DomUtil.create('div', 'store-info-control');
            this.update();
            return this._div;
        };
        infoControl.update = function (props) {
            if (props) {
                this._div.innerHTML = `<h4>📍 ${props.name}</h4><p>${props.description}</p>`;
                this._div.style.display = 'block';
            } else {
                this._div.innerHTML = '';
                this._div.style.display = 'none';
            }
        };
        infoControl.addTo(map);

        map.on('click', function() {
            infoControl.update(); // Hide info on map click
        });

        // All 12 branches
        const sucursales = [
            {
                name: 'Jesús María',
                address: 'And. Jesús María 136-1, Centro (Área 1), CDMX, C.P. 06020',
                coords: [19.42905, -99.12635],
                query: 'Andador+Jesus+Maria+136+Centro+Ciudad+de+Mexico+06020',
                description: 'Encuentra las mejores marcas en bonetería y artículos de temporada.'
            },
            {
                name: 'Tabaqueros',
                address: 'Cll. Tabaqueros 7, Local, Centro, CDMX, C.P. 06020',
                coords: [19.42985, -99.12800],
                query: 'Calle+Tabaqueros+7+Centro+Ciudad+de+Mexico+06020',
                description: 'Gran variedad de ropa interior y calcetería para toda la familia.'
            },
            {
                name: 'Julia y Julia B',
                address: 'Cll. de Venustiano Carranza 117, Centro, CDMX, C.P. 06000',
                coords: [19.42750, -99.13200],
                query: 'Venustiano+Carranza+117+Centro+Ciudad+de+Mexico+06000',
                description: 'Venta por mayoreo y menudeo de productos textiles de excelente calidad.'
            },
            {
                name: 'Manzanares',
                address: 'Cjn. Manzanares 22, Centro, CDMX, C.P. 06020',
                coords: [19.42670, -99.12600],
                query: 'Callejon+Manzanares+22+Centro+Ciudad+de+Mexico+06020',
                description: 'Todo lo que necesitas en bonetería y artículos varios a los mejores precios.'
            },
            {
                name: 'Hector',
                address: 'Cll. del Correo Mayor 91, Centro, CDMX, C.P. 06020',
                coords: [19.42950, -99.13050],
                query: 'Correo+Mayor+91+Centro+Ciudad+de+Mexico+06020',
                description: 'Especialistas en ropa interior, calcetería y novedades.'
            },
            {
                name: 'MG',
                address: 'Cll. Correo Mayor 22-1, Moneda y Soledad, Centro, CDMX, C.P. 06060',
                coords: [19.43280, -99.12991],
                query: 'Correo+Mayor+22+Moneda+y+Soledad+Centro+Ciudad+de+Mexico+06060',
                description: 'Amplio surtido en prendas de algodón y artículos para el hogar.'
            },
            {
                name: 'Regina',
                address: 'Cll. Regina 88, Pino Suárez y 20 de Nov., Centro, CDMX, C.P. 06020',
                coords: [19.42550, -99.13400],
                query: 'Calle+Regina+88+Centro+Ciudad+de+Mexico+06020',
                description: 'Calidad y precio en todo nuestro catálogo de bonetería.'
            },
            {
                name: 'Novedades Claudia',
                address: 'Del Correo Mayor 149, Col. Centro VII, CDMX, C.P. 06060',
                coords: [19.42700, -99.12950],
                query: 'Correo+Mayor+149+Colonia+Centro+Ciudad+de+Mexico+06060',
                description: 'Las últimas novedades en calcetería y ropa interior.'
            },
            {
                name: 'Bonetería Richi 1',
                address: 'Del Correo Mayor, Col. Centro VII, CDMX, C.P. 06060',
                coords: [19.42645, -99.13089],
                query: 'Correo+Mayor+Colonia+Centro+VII+Ciudad+de+Mexico+06060',
                description: 'Especialistas en bonetería para todas las edades.'
            },
            {
                name: 'Bonetería Richi 2',
                address: 'Del Correo Mayor 127, Col. Centro VII, CDMX, C.P. 06060',
                coords: [19.42653, -99.13081],
                query: 'Correo+Mayor+127+Colonia+Centro+VII+Ciudad+de+Mexico+06060',
                description: 'La mejor atención y extenso surtido en ropa interior.'
            },
            {
                name: 'Bonetería Richi 3',
                address: 'Del Correo Mayor 127-B, Col. Centro VII, CDMX, C.P. 06060',
                coords: [19.42653, -99.13086],
                query: 'Correo+Mayor+127+B+Colonia+Centro+VII+Ciudad+de+Mexico+06060',
                description: 'Surtido completo de calcetería y productos de bonetería.'
            },
            {
                name: 'Zapata',
                address: 'C. Emiliano Zapata 57 Int. B, Col. Centro, Cuauhtémoc, CDMX, C.P. 06000',
                coords: [19.42480, -99.13700],
                query: 'Emiliano+Zapata+57+Colonia+Centro+Cuauhtemoc+CDMX+06000',
                description: 'Mayoreo y menudeo de artículos de bonetería con excelente ubicación.'
            }
        ];

        const allMarkers = [];
        sucursales.forEach(s => {
            const popupHTML = `
                <div class="popup-content">
                    <h3>📍 ${s.name}</h3>
                    <p>${s.address}</p>
                </div>
            `;
            const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

            const marker = L.marker(s.coords, { icon: redIcon })
                .addTo(map)
                .bindPopup(popupHTML, { className: 'custom-popup' });

            allMarkers.push(marker);

            if (!isTouchDevice) {
                // Desktop: show popup on hover
                marker.on('mouseover', function () { 
                    this.openPopup(); 
                    infoControl.update(s);
                });
                marker.on('mouseout', function () { 
                    this.closePopup(); 
                    infoControl.update();
                });
            } else {
                marker.on('click', function () {
                    infoControl.update(s);
                });
            }

            // Double click: open Google Maps directly
            marker.on('dblclick', function (e) {
                L.DomEvent.stopPropagation(e);
                window.open('https://www.google.com/maps/search/?api=1&query=' + s.query, '_blank');
            });
        });

        // Fit map to show all markers
        if (allMarkers.length > 0) {
            const group = L.featureGroup(allMarkers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }
});
