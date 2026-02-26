/**
 * Tajen Belabn - Core Script
 * Refactored for Performance & Modern UX
 * Final Version: Integrated Auto-Hide Scroll Behavior, Old Price Tag, Dynamic Classic Read Mode,
 * Auto-expand Adjacent Cards (Desktop), and Persistent View Mode (LocalStorage).
 */

// --- 1. Database & Configuration ---

const CONFIG = {
    imagesPath: './images',
    animationClass: 'animate-fade-in-up',
    branches: {
        abokbeer: 'tel:01068702062',
        hehya: 'tel:01011350653',
        zagazig: 'tel:01080076320',
        faqous: 'tel:01068020434',
        kafrsaqr: 'tel:01068701310'
    },
    translations: {
        waffle: 'الوافل', new: 'العروض و الخصومات', omAli: 'أم علي', 
        dessert: 'الركن الشرقي', milkshake: 'ميلك شيك', juice: 'عصائر', 
        fruit_salad: 'فروت سلات', hot_drink: 'مشروبات ساخنة', extras: 'إضافات', 
        ice_cream: 'آيس كريم', bamboza: 'بمبوظة', gelaktico: 'جلاتيتو روما', 
        tajen: 'طواجن', qashtouta: 'قشطوطة', koshary: 'كشري الحلو', 
        innovations: 'اختراعات', rice: 'أرز باللبن'
    }
};

// Menu Structure Definition
const menuCategories = [
    { name: "new", seq: 0 }, { name: "qashtouta", seq: 1 }, { name: "rice", seq: 2 },
    { name: "innovations", seq: 3 }, { name: "koshary", seq: 4 }, { name: "bamboza", seq: 5 },
    { name: "tajen", seq: 6 }, { name: "omAli", seq: 7 }, { name: "waffle", seq: 8 },
    { name: "dessert", seq: 9 }, { name: "milkshake", seq: 10 }, { name: "juice", seq: 11 },
    { name: "ice_cream", seq: 12 }, { name: "fruit_salad", seq: 13 }, { name: "gelaktico", seq: 14 },
    { name: "extras", seq: 15 }
];

// Menu Items Data
const menuData = {
    new: [
        { id: 1, name: "عرض الـ200", price: 200, old_price: 250, description: "قشطوطه فواكه، بمبوظه مانجا، رز بلبن اوريو كيت كات، طاجن نوتيلا، رز بلبن " },
        { id: 2, name: "عرض الـ130", price: 130, old_price: 150, description: "الفزعه، البشويشه " },
        { id: 3, name: "اساور الست", price: 100, old_price: 150, description: null },
    ],
    innovations: [
        { id: 1, name: "قنبلة اسكندراني", price: 65, description: "رز بلبن، عصير، قشطة، موز، تفاح، قطع مانجا، بسبوسة، كنافة، قشطة" },
        { id: 2, name: "دلوعه مانجا", price: 65, description: "رز بلبن، كنافة، قشطة، مانجا، كيندر" },
        { id: 3, name: "بقلوظة مانجا", price: 65, description: "رز بلبن، مانجا، ايس كريم، قشطة، بسبوسة، كنافة" },
        { id: 4, name: "المدرعة", price: 65, description: "رز بلبن، جلاش، ايس كريم، كيندر، نوتيلا" },
        { id: 5, name: "قدرة قادر", price: 70, description: "رز بلبن، ايس كريم، مكسرات، نوتيلا، موز، لوتس، كراميل" },
        { id: 6, name: "ماشينكاح", price: 70, description: "رز بلبن، ميلفيه، مانجا، قشطة، مكسرات" },
        { id: 7, name: "الفولت العالي", price: 70, description: "رز بلبن، كوكتيل فواكه، نوتيلا، كيندر، مكسرات" },
        { id: 8, name: "القاضية", price: 70, description: "رز بلبن، قشطة، ايس كريم، مكسرات، بسبوسة" },
        { id: 9, name: "كود 36", price: 70, description: "رز بلبن، مانجا، كنافة، بسبوسة، مكسرات، ايس كريم" },
        { id: 10, name: "اليكتريك", price: 70, description: "رز بلبن، لوتس، اوريو، نوتيلا، كيندر، كراميل، قشطة، مكسرات" },
        { id: 11, name: "ترويقة", price: 75, description: "رز بلبن، مانجا، ايس كريم، عسل، مكسرات" }
    ],
    qashtouta: [
        { id: 1, name: "قشطوطة كراميل", price: 50, description: null },
        { id: 2, name: "قشطوطة فاكهه", price: 55, description: null },
        { id: 3, name: "قشطوطة مانجا", price: 55, description: null },
        { id: 4, name: "قشطوطة اوريو", price: 55, description: null },
        { id: 5, name: "قشطوطة نوتيلا", price: 55, description: null },
        { id: 6, name: "قشطوطة لوتس", price: 55, description: null },
        { id: 7, name: "قشطوطة كنافة", price: 60, description: null },
        { id: 8, name: "قشطوطة مكسرات", price: 65, description: null },
        { id: 9, name: "قشطوطة ميكس نوتيلا", price: 65, description: null },
        { id: 10, name: "قشطوطة فسدق", price: 70, description: null },
        { id: 11, name: "قشطوطة أرز بلبن مانجا", price: 75, description: null },
        { id: 12, name: "قشطوطة نوتيلا مكسرات", price: 75, description: null },
        { id: 13, name: "قشطوطة أرز بلبن نوتيلا", price: 75, description: null },
        { id: 14, name: "قشطوطة الطبطبة", price: 75, description: "كنافة، مانجا، نوتيلا، لوتس، مكسرات" },
        { id: 15, name: "قشطوطة كف القمر", price: 75, description: "ايس كريم، بسبوسة، كراميل، مكسرات، قشطة، نوتيلا" },
        { id: 16, name: "قشطوطة كامانجا", price: 75, description: "كنافة، مانجا، مكسرات، نوتيلا" },
        { id: 17, name: "قشطوطة الهضبة", price: 80, description: "رز بلبن، كيت كات، اوريو، موز، فسدق" },
        { id: 18, name: "قشطوطة برو ماكس", price: 80, description: "رز بلبن، نوتيلا، فواكه، مكسرات" },
        { id: 19, name: "قشطوطة هامر", price: 80, description: "رز بلبن، فسدق، لوتس، مانجا" },
        { id: 20, name: "قشطوطة الغيبويه", price: 80, description: "رز بلبن، كنافة، فسدق، مانجة" },
        { id: 21, name: "قشطوطة الهشتكة", price: 80, description: "نوتيلا، لوتس، كراميل، اوريو، كيندر، قشطة، مكسرات" },
        { id: 22, name: "قشطوطة وحش الكون", price: 80, description: "اوريو، لوتس، بيستاشيو، مكسرات" },
        { id: 23, name: "قشطوطة لفل الوحش", price: 80, description: "رز بلبن، نوتيلا، لوتس، مانجا، مكسرات" }
    ],
    waffle: [
        { id: 1, name: "وافل نوتيلا", price: 65, description: null },
        { id: 2, name: "وافل كراميل", price: 65, description: null },
        { id: 3, name: "وافل لوتس", price: 65, description: null },
        { id: 4, name: "وافل ميكس نوتيلا لوتس", price: 70, description: null },
        { id: 5, name: "وافل قشطوطه لوتس", price: 70, description: null },
        { id: 6, name: "وافل نوتيلا فواكة", price: 70, description: null },
        { id: 7, name: "وافل قشطة فواكة بالعسل", price: 70, description: null },
        { id: 8, name: "وافل نوتيلا قشطة مكسرات", price: 80, description: null },
        { id: 9, name: "وافل مثلث برمودا", price: 85, description: "نوتيلا، كيندر، فسدق" },
        { id: 10, name: "وافل بستاشيو", price: 90, description: null }
    ],
    koshary: [
        { id: 1, name: "كشري مانجة", price: 55, description: null },
        { id: 2, name: "كشري لوتس", price: 65, description: null },
        { id: 3, name: "كشري نوتيلا", price: 65, description: null },
        { id: 4, name: "كشري اوريو", price: 65, description: null },
        { id: 5, name: "كشري فواكة", price: 65, description: null },
        { id: 6, name: "كشري ميكس نوتيلا لوتس", price: 70, description: null },
        { id: 7, name: "كشري فسدق", price: 75, description: null }
    ],
    rice: [
        { id: 1, name: "ارز بلبن سادة", price: 22.5, description: null },
        { id: 2, name: "ارز بلبن آيس كريم", price: 45, description: null },
        { id: 3, name: "ارز بلبن نوتيلا", price: 45, description: null },
        { id: 4, name: "ارز بلبن لوتس", price: 45, description: null },
        { id: 5, name: "ارز بلبن مانجا قطع", price: 50, description: null },
        { id: 6, name: "ارز بلبن اوريو وايت صوص", price: 50, description: null },
        { id: 7, name: "ارز بلبن مكسرات", price: 50, description: null },
        { id: 8, name: "ارز بلبن ميكس كيت اوريو", price: 55, description: null },
        { id: 9, name: "ارز بلبن آيس كريم نوتيلا", price: 55, description: null },
        { id: 10, name: "ارز بلبن قشطة مكسرات", price: 55, description: null },
        { id: 11, name: "ارز بلبن فسدق", price: 60, description: null },
        { id: 12, name: "ارز بلبن آيس كريم مكسرات", price: 65, description: null },
        { id: 13, name: "ارز بلبن نوتيلا مكسرات", price: 65, description: null }
    ],
    ice_cream: [
        { id: 1, name: "فانيليا", price: 20, price2: 40, description: null },
        { id: 2, name: "فراولة", price: 20, price2: 40, description: null },
        { id: 3, name: "مانجا", price: 20, price2: 40, description: null },
        { id: 4, name: "شيكولاتة", price: 20, price2: 40, description: null },
        { id: 5, name: "توت أزرق", price: 20, price2: 40, description: null },
        { id: 6, name: "أوريو", price: 20, price2: 40, description: null },
        { id: 7, name: "لوتس", price: 20, price2: 40, description: null },
        { id: 8, name: "الرايق", price: 25, price2: 50, description: "ميكس من اختيارك" }
    ],
    gelaktico: [
        { id: 1, name: "چيلاتيتو روما نوتيلا", price: 70, description: null },
        { id: 2, name: "چيلاتيتو روما لوتس", price: 70, description: null },
        { id: 3, name: "چيلاتيتو روما اوريو", price: 70, description: null },
        { id: 4, name: "چيلاتيتو روما كيت كات", price: 75, description: null },
        { id: 5, name: "چيلاتيتو روما كنافة دبي", price: 80, description: null }
    ],
    bamboza: [
        { id: 1, name: "بمبوظة مانجا", price: 65, description: null },
        { id: 2, name: "بمبوظة نوتيلا", price: 70, description: null },
        { id: 3, name: "بمبوظة لوتس", price: 70, description: null },
        { id: 4, name: "بمبوظة أوريو", price: 70, description: null },
        { id: 5, name: "بمبوظة مكسرات", price: 80, description: null },
        { id: 6, name: "بمبوظة فسدق", price: 80, description: null }
    ],
    milkshake: [
        { id: 1, name: "ميلك شيك فانيليا", price: 45, description: null },
        { id: 2, name: "ميلك شيك مانجا", price: 50, description: null },
        { id: 3, name: "ميلك شيك فراولة", price: 50, description: null },
        { id: 4, name: "ميلك شيك توت ازرق", price: 50, description: null },
        { id: 5, name: "ميلك شيك موز", price: 50, description: null },
        { id: 6, name: "ميلك شيك كراميل", price: 50, description: null },
        { id: 7, name: "ميلك شيك شيكولاتة", price: 50, description: null },
        { id: 8, name: "ميلك شيك نوتيلا", price: 50, description: null },
        { id: 9, name: "ميلك شيك لوتس", price: 50, description: null },
        { id: 10, name: "ميلك شيك اوريو", price: 55, description: null },
        { id: 11, name: "ميلك شيك مكسرات", price: 60, description: null },
        { id: 12, name: "ميلك شيك ميكس شيكولاتة", price: 65, description: null },
        { id: 13, name: "ميلك شيك فسدق", price: 85, description: null }
    ],
    tajen: [
        { id: 1, name: "طاجن نوتيلا", price: 45, description: null },
        { id: 2, name: "طاجن كنافة بالمانجا", price: 45, description: null },
        { id: 3, name: "طاجن أوريو", price: 50, description: null },
        { id: 4, name: "طاجن لوتس", price: 50, description: null },
        { id: 5, name: "طاجن كيت كات", price: 50, description: null },
        { id: 6, name: "طاجن كيندر", price: 55, description: null },
        { id: 7, name: "طاجن مكسرات", price: 65, description: null },
        { id: 8, name: "طاجن فسدق", price: 70, description: null },
        { id: 9, name: "طاجن هبة دبي M", price: 70, description: null },
        { id: 10, name: "الفزعه", price: 80, description: "شيكولاته، نوتيلا" },
        { id: 11, name: "طاجن هبة دبي L", price: 130, description: null }
    ],
    omAli: [
        { id: 1, name: "أم علي بالسمن البلدي", price: 35, description: null },
        { id: 2, name: "أم علي قشطة بالعسل", price: 45, description: null },
        { id: 3, name: "أم علي اوريو وايت صوص", price: 45, description: null },
        { id: 4, name: "أم علي لوتس", price: 45, description: null },
        { id: 5, name: "أم علي نوتيلا", price: 45, description: null },
        { id: 6, name: "أم علي مكسرات", price: 50, description: null },
        { id: 7, name: "أم علي قشطة مكسرات", price: 50, description: null },
        { id: 8, name: "أم علي آيس كريم مكسرات", price: 55, description: null },
        { id: 9, name: "طبق السلطان", price: 55, description: "أم علي، نوتيلا، صوص لوتس، بسكويت لوتس، مكسرات، قشطة" }
    ],
    juice: [
        { id: 1, name: "مانجا", price: 40, description: null },
        { id: 2, name: "فراولة", price: 40, description: null },
        { id: 3, name: "موز بلبن", price: 45, description: null },
        { id: 4, name: "فراولة بلبن", price: 45, description: null },
        { id: 5, name: "مانجا بلبن", price: 45, description: null },
        { id: 6, name: "بلح بلبن", price: 45, description: null },
        { id: 7, name: "اكس باور", price: 55, description: "موز، بلح، مكسرات" }
    ],
    fruit_salad: [
        { id: 1, name: "فروت سلات فواكة", price: 45, description: null },
        { id: 2, name: "فروت سلات آيس كريم", price: 65, description: null },
        { id: 3, name: "فروت سلات فواكة مكسرات", price: 65, description: null }
    ],
    dessert: [
        { id: 1, name: "بسبوسة مكسرات", price: 50, description: null },
        { id: 2, name: "البشويشه", price: 70, description: "كنافه، فسدق، لوتس، كيندر، نوتيلا" },
        { id: 3, name: "اساور الست", price: 100, old_price: 150, description: null },
        { id: 4, name: "كنافة فور سيزون", price: 150, description: "نوتيلا، لوتس، اوريو، مانجة، مكسرات" }
    ],
    extras: [
        { id: 1, name: "عسل نحل", price: 5, description: null },
        { id: 2, name: "قشطة", price: 10, description: null },
        { id: 3, name: "بسكويت مجروش", price: 10, description: null },
        { id: 4, name: "حلويات", price: 10, description: null },
        { id: 5, name: "فواكة", price: 15, description: null },
        { id: 6, name: "صوص نوتيلا", price: 15, description: null },
        { id: 7, name: "صوص كيندر", price: 15, description: null },
        { id: 8, name: "آيس كريم", price: 15, description: null },
        { id: 9, name: "مكسرات", price: 25, description: null },
        { id: 10, name: "فسدق", price: 25, description: null }
    ]
};

// --- 2. State Management ---
const state = {
    isReadMode: false,
    activeCategory: null,
    isMenuLoaded: false
};

// --- 3. DOM Elements ---
const elements = {
    loading: document.getElementById('loading'),
    menuContainer: document.getElementById('menu-container'),
    readModeContainer: document.getElementById('read-mode-container'), 
    dropdownMenu: document.getElementById('dropdown-menu'),
    dropdownBtn: document.getElementById('dropdown-btn'),
    dropdownArrow: document.getElementById('dropdown-arrow'),
    readModeBtn: document.getElementById('toggle-read-mode'),
    branchSelect: document.getElementById('branch-select'),
    callBtn: document.getElementById('call-now-btn'),
    copyrightYear: document.getElementById('copyright-year'),
    header: document.querySelector('header'),
    bottomBar: document.getElementById('bottom-bar')
};

// --- 4. Initialization ---

document.addEventListener('DOMContentLoaded', init);

function init() {
    // 1. Set Copyright
    if (elements.copyrightYear) elements.copyrightYear.textContent = new Date().getFullYear();

    // 2. Render Menu
    renderMenu();

    // 3. Setup Listeners
    setupEventListeners();

    // 4. Update Call Button
    updateCallButton();

    // 5. Check Persistent View Mode Preference
    const savedViewMode = localStorage.getItem('tajen_view_mode');
    if (savedViewMode === 'read') {
        toggleReadMode(); // Activate read mode immediately if it was the last saved choice
    }

    // 6. Hide Loading Screen
    setTimeout(() => {
        elements.loading.style.opacity = '0';
        setTimeout(() => {
            elements.loading.style.display = 'none';
        }, 500);
    }, 800);
}

// --- 5. Rendering Logic (Main Menu) ---

function renderMenu() {
    // Sort categories by sequence
    const sortedCategories = menuCategories
        .sort((a, b) => a.seq - b.seq)
        .filter(cat => menuData[cat.name] && menuData[cat.name].length > 0);

    // Create DocumentFragment for performance
    const fragment = document.createDocumentFragment();

    sortedCategories.forEach((category) => {
        // Create Section
        const section = document.createElement('section');
        section.id = category.name;
        section.className = 'scroll-section opacity-0 translate-y-8 transition-all duration-700 ease-out mb-12';

        // Header
        const header = createSectionHeader(category.name);
        section.appendChild(header);

        // Grid
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6';
        
        // Items
        menuData[category.name].forEach(item => {
            grid.appendChild(createItemCard(item, category.name));
        });

        section.appendChild(grid);
        fragment.appendChild(section);

        // Add to Dropdown
        addToDropdown(category.name);
    });

    elements.menuContainer.appendChild(fragment);
    
    // Trigger Animations
    setupIntersectionObserver();
}

function createSectionHeader(categoryName) {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-3 mb-6 pb-2 border-b-2 border-gray-200';
    
    // Add fire icon for 'new'
    const isNew = categoryName === 'new';
    const icon = isNew ? '🔥' : '🍽️';
    const textColor = isNew ? 'text-[#FFD700]' : 'text-[#0074d9]';
    
    div.innerHTML = `
        <span class="text-2xl">${icon}</span>
        <h2 class="text-2xl md:text-3xl font-bold ${textColor}">${CONFIG.translations[categoryName] || categoryName}</h2>
    `;
    
    if(isNew) div.classList.replace('border-gray-200', 'border-[#FFD700]');
    
    return div;
}

function createItemCard(item, categoryName) {
    const card = document.createElement('div');
    const isOffer = categoryName === 'new';
    
    // Base Classes
    let classes = 'item-card group';
    if (isOffer) classes += ' offer-card';
    card.className = classes;

    // Image Path
    const imagePath = `${CONFIG.imagesPath}/${categoryName}/${item.id}.jpg`;

    // --- Template Construction ---
    
    // Offer Badge
    let badgeHtml = '';
    if (isOffer) {
        badgeHtml = `
            <div class="offer-badge">
                <i class="fas fa-star text-[10px]"></i> عرض خاص
            </div>
        `;
    }

    // Price Logic
    let oldPriceHtml = '';
    if (item.old_price) {
        oldPriceHtml = `
            <span class="relative inline-block text-white/70 text-xs md:text-sm font-medium mr-1" title="السعر القديم">
                ${item.old_price} ج
                <span style="position: absolute; top: 50%; left: -5%; width: 110%; height: 2px; background-color: #ef4444; transform: rotate(-15deg); border-radius: 2px; box-shadow: 0 0 2px rgba(239, 68, 68, 0.4);"></span>
            </span>
        `;
    }

    let priceHtml = '';
    if (item.price2) {
        priceHtml = `
            <div class="flex gap-2 items-center mt-1">
                <div class="price-display text-xs">S: ${item.price} ج</div>
                <div class="price-display text-xs">L: ${item.price2} ج</div>
            </div>
        `;
    } else {
        priceHtml = `
            <div class="mt-1">
                <div class="price-display">
                    <span>${item.price} ج</span>
                    ${oldPriceHtml}
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        ${badgeHtml}
        
        <div class="p-4 flex items-center gap-4 relative z-10">
            <div class="relative w-20 h-20 flex-shrink-0">
                <img src="${imagePath}" 
                     alt="${item.name}" 
                     class="item-img-thumb w-full h-full object-cover rounded-xl shadow-md border border-gray-100"
                     loading="lazy"
                     onerror="this.src='https://placehold.co/100x100?text=Tajen';this.style.opacity=0.5;">
            </div>
            
            <div class="flex-grow">
                <h3 class="text-lg font-bold text-gray-800 leading-tight mb-1 transition-colors">${item.name}</h3>
                ${priceHtml}
            </div>
            
            <div class="text-gray-300 flex-shrink-0">
                <i class="fas fa-chevron-down transform transition-transform duration-300 group-hover:text-[#0074d9]"></i>
            </div>
        </div>

        <div class="item-details px-4 pb-4">
            <div class="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-3 border border-white/20 shadow-inner">
                <img src="${imagePath}" 
                     class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                     loading="lazy" 
                     alt="${item.name} details"
                     onerror="this.src='https://placehold.co/400x300?text=Tajen';">
            </div>
            
            ${item.description ? `<p class="text-sm font-medium opacity-90 mb-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">${item.description}</p>` : ''}
            
            <button class="w-full bg-white text-[#0074d9] font-bold py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <i class="fas fa-utensils"></i> صحة وعافية
            </button>
        </div>
    `;

    // Click Handler (Accordion Logic)
    card.addEventListener('click', (e) => toggleCard(card));

    return card;
}

// --- 6. Interactivity & UX Logic ---

// Helper functions for card state
function openCardElement(card) {
    card.classList.add('expanded');
    const icon = card.querySelector('.fa-chevron-down');
    if (icon) icon.style.transform = 'rotate(180deg)';
}

function closeCardElement(card) {
    card.classList.remove('expanded');
    const icon = card.querySelector('.fa-chevron-down');
    if (icon) icon.style.transform = 'rotate(0deg)';
}

function toggleCard(selectedCard) {
    const isExpanded = selectedCard.classList.contains('expanded');
    
    // Check if we are on a desktop screen (where grid-cols-2 is active)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    
    let siblingCard = null;

    if (isDesktop) {
        // Find the adjacent sibling in the same grid row
        const parentGrid = selectedCard.parentElement;
        const siblings = Array.from(parentGrid.children);
        const index = siblings.indexOf(selectedCard);

        if (index % 2 === 0 && index + 1 < siblings.length) {
            // It's the left card (even index), so its partner is the next one
            siblingCard = siblings[index + 1];
        } else if (index % 2 !== 0 && index - 1 >= 0) {
            // It's the right card (odd index), so its partner is the previous one
            siblingCard = siblings[index - 1];
        }
    }

    // 1. Close all other cards (Except the selected one and its sibling partner)
    document.querySelectorAll('.item-card.expanded').forEach(card => {
        if (card !== selectedCard && card !== siblingCard) {
            closeCardElement(card);
        }
    });

    // 2. Toggle the selected card (and its sibling if it exists)
    if (isExpanded) {
        closeCardElement(selectedCard);
        if (siblingCard) closeCardElement(siblingCard);
    } else {
        openCardElement(selectedCard);
        if (siblingCard) openCardElement(siblingCard);
    }

    // 3. Scroll into view if opening
    if (!isExpanded) {
        setTimeout(() => {
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

function addToDropdown(categoryName) {
    const link = document.createElement('a');
    link.href = `#${categoryName}`;
    link.className = 'block px-4 py-3 text-sm font-semibold border-b border-white/5 last:border-0';
    link.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full bg-[#38bdf8] ml-2"></span>
        ${CONFIG.translations[categoryName]}
    `;
    
    link.addEventListener('click', (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.add('hidden');
        const target = document.getElementById(categoryName);
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    });
    
    elements.dropdownMenu.appendChild(link);
}

// --- 7. Read Mode Logic (Dynamic Classic Menu) ---

function toggleReadMode() {
    state.isReadMode = !state.isReadMode;
    const btnIcon = elements.readModeBtn.querySelector('i');
    const btnText = elements.readModeBtn.querySelector('span');

    if (state.isReadMode) {
        // Activate Read Mode
        elements.menuContainer.classList.add('hidden');
        elements.readModeContainer.classList.remove('hidden');
        elements.readModeContainer.classList.add('block'); 
        
        btnIcon.className = 'fas fa-th-large';
        btnText.textContent = 'وضع القائمة';

        // التحقق مما إذا كانت الحاوية الداخلية فارغة لإنشائها مرة واحدة فقط
        const classicContainer = document.getElementById('classic-menu-container');
        if (classicContainer && classicContainer.children.length === 0) {
            renderClassicMenu();
        }
        window.scrollTo(0, 0);

    } else {
        // Deactivate Read Mode
        elements.menuContainer.classList.remove('hidden');
        elements.readModeContainer.classList.add('hidden');
        elements.readModeContainer.classList.remove('block');
        
        btnIcon.className = 'fas fa-book-open';
        btnText.textContent = 'وضع القراءة';
    }

    // Save Preference to LocalStorage
    localStorage.setItem('tajen_view_mode', state.isReadMode ? 'read' : 'grid');
}

// بناء وضع القراءة الكلاسيكي ديناميكياً من البيانات بالهيكل الجديد
function renderClassicMenu() {
    const container = document.getElementById('classic-menu-container');
    const fragment = document.createDocumentFragment();

    const sortedCategories = menuCategories
        .sort((a, b) => a.seq - b.seq)
        .filter(cat => menuData[cat.name] && menuData[cat.name].length > 0);

    sortedCategories.forEach((category) => {
        const section = document.createElement('div');
        section.className = 'mb-10'; // تقليل المسافة بين الأقسام قليلاً
        
        const isNew = category.name === 'new';
        const titleColor = isNew ? 'text-brand-gold' : 'text-gray-800';
        const lineColor = isNew ? 'bg-brand-gold/30' : 'bg-gray-200';
        const translatedName = CONFIG.translations[category.name] || category.name;

        section.innerHTML = `
            <div class="flex items-center justify-center gap-4 mb-6">
                <div class="h-[1px] ${lineColor} flex-1"></div>
                <h2 class="text-xl md:text-2xl font-extrabold ${titleColor} px-2">
                    ${translatedName}
                </h2>
                <div class="h-[1px] ${lineColor} flex-1"></div>
            </div>
            <div class="flex flex-col gap-5"></div>
        `;

        const listContainer = section.querySelector('.flex-col');

        menuData[category.name].forEach((item, index) => {
            const imagePath = `${CONFIG.imagesPath}/${category.name}/${item.id}.jpg`;
            
            // --- تعديل هندسة السعر ليكون له عرض ثابت ---
            let priceHtml = '';
            let oldPriceHtml = item.old_price 
                ? `<span class="text-[11px] text-red-400 line-through mx-1 font-tajawal">${item.old_price}ج</span>` 
                : '';

            if (item.price2) {
                // في حال السعرين: يتم عرضهم بشكل رأسي أو منسق لضمان العرض الثابت
                priceHtml = `
                    <div class="flex flex-col text-left font-bold text-gray-800 bg-gray-50/50 px-2 py-0.5 rounded border border-gray-100/50 w-full">
                        <div class="flex justify-between items-center text-[13px] md:text-sm">
                            <span class="text-[10px] text-gray-400 font-tajawal ml-1">S:</span>
                            <span>${item.price}<span class="text-[10px] text-gray-500 mr-0.5">ج</span></span>
                        </div>
                        <div class="flex justify-between items-center text-[13px] md:text-sm border-t border-gray-100">
                            <span class="text-[10px] text-gray-400 font-tajawal ml-1">L:</span>
                            <span>${item.price2}<span class="text-[10px] text-gray-500 mr-0.5">ج</span></span>
                        </div>
                    </div>
                `;
            } else {
                // في حال السعر الواحد
                priceHtml = `
                    <div class="text-left font-bold text-gray-800 text-base md:text-lg flex justify-end items-center w-full">
                        ${oldPriceHtml}
                        ${item.price} <span class="text-xs text-gray-500 mr-1 font-tajawal mt-1">ج.م</span>
                    </div>
                `;
            }

            // --- تعديل هندسة الوصف ليكون أصغر وأقرب للاسم ---
            let descHtml = item.description 
                ? `
                <p class="text-[12px] md:text-[13px] text-gray-500 font-tajawal leading-snug mt-0.5 pr-1">
                    ${item.description}
                </p>
                ` 
                : '';

            const itemDiv = document.createElement('div');
            itemDiv.style.animationDelay = `${index * 0.05}s`;
            itemDiv.className = 'list-item-animate opacity-0 w-full group transition-all duration-300 hover:bg-white p-2 -mx-2 rounded-xl';
            
            // --- الهيكل الجديد: (الصورة) ثم (الاسم + الوصف معاً) ثم (النقط) ثم (حاوية السعر الثابتة) ---
            itemDiv.innerHTML = `
                <div class="flex items-start w-full gap-3">
                    
                    <div class="flex-shrink-0 mt-1">
                        <img src="${imagePath}" 
                             alt="${item.name}" 
                             class="img-menu w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-200 bg-gray-50"
                             onerror="this.src='https://placehold.co/100x100?text=Logo';">
                    </div>
                    
                    <div class="flex-grow flex flex-col justify-center min-w-0">
                        
                        <div class="flex items-center w-full">
                            <h3 class="text-sm md:text-base font-bold text-gray-800 transition-colors group-hover:text-brand-blue whitespace-nowrap">
                                ${item.name}
                            </h3>
                            
                            <div class="dotted-leader"></div>
                            
                            <div class="flex-shrink-0 w-[75px] md:w-[90px] flex justify-end">
                                ${priceHtml}
                            </div>
                        </div>
                        
                        ${descHtml}

                    </div>
                </div>
            `;

            listContainer.appendChild(itemDiv);
        });

        fragment.appendChild(section);
    });

    container.appendChild(fragment);
}

// --- 8. Event Listeners Setup ---

function setupEventListeners() {
    // Dropdown
    if (elements.dropdownBtn) {
        elements.dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.dropdownMenu.classList.toggle('hidden');
            elements.dropdownArrow.classList.toggle('rotate-180');
        });
    }

    // Close Dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!elements.dropdownBtn.contains(e.target) && !elements.dropdownMenu.contains(e.target)) {
            elements.dropdownMenu.classList.add('hidden');
            if(elements.dropdownArrow) elements.dropdownArrow.classList.remove('rotate-180');
        }
    });

    // Branch Select
    if (elements.branchSelect) {
        elements.branchSelect.addEventListener('change', updateCallButton);
    }

    // Read Mode
    if (elements.readModeBtn) {
        elements.readModeBtn.addEventListener('click', toggleReadMode);
    }

    // --- Scroll Behavior for Auto-Hide Navbar & Bottom Bar ---
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Define direction and position
        const isScrollingDown = currentScrollY > lastScrollY;
        const isAtTop = currentScrollY < 50; 

        // Safety check if elements exist
        if (!elements.header || !elements.bottomBar) return;

        if (isScrollingDown && !isAtTop) {
            // Hide elements
            elements.header.classList.add('nav-hidden');
            elements.bottomBar.classList.add('bar-hidden');
            
            // Close dropdown if open
            if(elements.dropdownMenu) elements.dropdownMenu.classList.add('hidden');
        } else {
            // Show elements
            elements.header.classList.remove('nav-hidden');
            elements.bottomBar.classList.remove('bar-hidden');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}

function updateCallButton() {
    if (!elements.branchSelect || !elements.callBtn) return;
    const selectedBranch = elements.branchSelect.value;
    elements.callBtn.href = CONFIG.branches[selectedBranch];
}

// --- 9. Animations (Intersection Observer) ---

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.scroll-section').forEach(section => {
        observer.observe(section);
    });
}