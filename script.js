import { menu, menu_database_db } from './menu.js';

// --- الثوابت والإعدادات ---
const IMAGE_BASE_PATH = './images';
const READ_MODE_PATH = './read'; // مسار صور وضع القراءة
const categoryTranslations = {
    waffle: 'الوافل', new: 'العروض و الخصومات', omAli: 'أم علي', dessert: 'الركن الشرقي', 
    milkshake: 'ميلك شيك', juice: 'عصائر', fruit_salad: 'فروت سلات', 
    hot_drink: 'مشروبات ساخنة', extras: 'إضافات', ice_cream: 'آيس كريم', 
    bamboza: 'بمبوظة', gelaktico: 'جلاتيتو روما', tajen: 'طواجن', 
    qashtouta: 'قشطوطة', koshary: 'كشري الحلو', innovations: 'اختراعات', 
    rice: 'أرز باللبن' 
};
const branchPhoneNumbers = { 
    abokbeer: 'tel:01068702062', hehya: 'tel:01011350653', 
    zagazig: 'tel:01080076320', faqous: 'tel:01068020434', 
    kafrsaqr: 'tel:01068701310' 
};

// --- عناصر DOM ---
const loadingScreen = document.getElementById('loading');
const header = document.querySelector("header");
const dropdownContainer = document.getElementById('dropdown-container'); // الحاوية الكاملة للزر والقائمة
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const menuContainer = document.getElementById('menu-container');
const readModeContainer = document.getElementById('read-mode-container');
const bottomBar = document.getElementById('bottom-bar');
const branchSelect = document.getElementById('branch-select');
const callNowBtn = document.getElementById('call-now-btn');

// أزرار وضع القراءة
const readModeDesktopBtn = document.getElementById('toggle-read-mode-desktop');
const readModeMobileBtn = document.getElementById('toggle-read-mode-mobile');

// --- متغيرات الحالة ---
let isReadMode = false;
let lastScrollY = window.scrollY;

// --- دوال مساعدة ---
function formatNameWithLineBreak(name, maxLength) {
    if (name.length <= maxLength) return name;
    const breakPointIndex = name.indexOf(' ', maxLength);
    if (breakPointIndex === -1) return name;
    const part1 = name.substring(0, breakPointIndex);
    const part2 = name.substring(breakPointIndex + 1);
    return `${part1} <br>${part2}`; 
}

function handleImageError() {
    this.onerror = null;
    const noPicDiv = document.createElement('div');
    noPicDiv.className = "w-full h-full rounded-md bg-gray-700 flex items-center justify-center text-gray-400 text-xs";
    noPicDiv.textContent = 'No Pic';
    if (this.parentElement) {
        this.parentElement.replaceChild(noPicDiv, this);
    }
}

// --- الوظائف الرئيسية للمنيو ---

function loadAndProcessMenu() {
    try {
        const categoriesInOrder = menu_database_db
            .sort((a, b) => a.seq - b.seq)
            .map(cat => cat.name)
            .filter(name => menu[name] && menu[name].length > 0);
            
        const processedMenu = {};
        categoriesInOrder.forEach(categoryName => {
            processedMenu[categoryName] = menu[categoryName].map(item => ({ 
                ...item, 
                full_image_path: `${IMAGE_BASE_PATH}/${categoryName}/${item.id}.jpg` 
            }));
        });
        
        renderDropdown(categoriesInOrder);
        renderMenu(processedMenu, categoriesInOrder);
        loadingScreen.style.display = "none";
    } catch (error) {
        console.error("Error processing local menu data:", error);
        loadingScreen.innerHTML = `<div class="text-center p-4"><p class="text-red-500 text-xl font-bold">خطأ في عرض المنيو</p></div>`;
    }
}

function renderDropdown(categories) {
    dropdownMenu.innerHTML = "";
    categories.forEach(category => {
        const link = document.createElement("a");
        link.href = `#${category}`;
        link.textContent = categoryTranslations[category] || category;
        link.className = "block px-4 py-2 text-white hover:bg-[#0074d9] rounded-md mx-1";
        link.onclick = (e) => {
            e.preventDefault();
            const section = document.getElementById(category);
            if (section) {
                // حساب المسافة لتعويض الهيدر الثابت
                const headerOffset = 140; 
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
            dropdownMenu.classList.add("hidden");
        };
        dropdownMenu.appendChild(link);
    });
}

function renderMenu(menuData, categoriesInOrder) {
    menuContainer.innerHTML = "";
    categoriesInOrder.forEach((categoryName, index) => {
        const section = document.createElement("section");
        section.id = categoryName;
        section.className = "menu-section";
        
        const title = document.createElement("h2");
        const titleColorClass = categoryName === 'new' ? "text-[#FFD700]" : "text-[#00a2fa]";
        const borderColorClass = categoryName === 'new' ? "border-[#FFD700]" : "border-[#0074d9]/50";
        
        title.className = `text-3xl font-extrabold ${titleColorClass} mb-6 border-b-2 ${borderColorClass} pb-3`;
        const text = categoryTranslations[categoryName] || categoryName;
        const iconSuffix = categoryName === 'new' ? ' 🔥' : ''; 
        title.textContent = text + iconSuffix;
        
        section.appendChild(title);
        
        const grid = document.createElement("div");
        grid.className = "grid grid-cols-1 md:grid-cols-2 gap-6";
        
        menuData[categoryName].forEach(item => {
            grid.appendChild(createItemCard(item, categoryName)); 
        });
        
        section.appendChild(grid);
        menuContainer.appendChild(section);
        
        if (index < categoriesInOrder.length - 1) {
            const separator = document.createElement("hr");
            separator.className = "section-separator";
            menuContainer.appendChild(separator);
        }
    });
}

function createItemCard(item, category = '') { 
    const card = document.createElement("div");
    let cardClasses = "item-card relative rounded-lg shadow-xl overflow-hidden transition-all duration-300";
    if (category === 'new') cardClasses += " offer-card";
    
    card.className = cardClasses;
    card.style.setProperty("--banner-normal", `url('${IMAGE_BASE_PATH}/banner/normal.png')`);
    card.style.setProperty("--banner-expanded", `url('${IMAGE_BASE_PATH}/banner/expend.png')`);

    // شارة العروض
    if (category === 'new') {
        const badge = document.createElement("div");
        badge.className = "offer-badge";
        badge.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
            </svg>
            لفتره محدوده
        `;
        card.appendChild(badge);
    }

    // الملخص (Summary) - الجزء الظاهر دائماً
    const summary = document.createElement("div");
    summary.className = "p-4 cursor-pointer flex items-center space-x-4 space-x-reverse";

    const summaryImgContainer = document.createElement('div');
    summaryImgContainer.className = 'relative w-20 h-20 flex-shrink-0';
    const summaryImg = document.createElement('img');
    summaryImg.src = item.full_image_path;
    summaryImg.alt = item.name;
    
    const imgBorderClass = category === 'new' ? "border-[#FFD700]" : "border-gray-600";
    summaryImg.className = `w-20 h-20 rounded-md object-cover border-2 ${imgBorderClass}`;
    summaryImg.loading = 'lazy';
    summaryImg.onerror = handleImageError;
    summaryImgContainer.appendChild(summaryImg);

    const summaryText = document.createElement('div');
    summaryText.className = 'flex-grow flex flex-col justify-center';
    const formattedName = formatNameWithLineBreak(item.name, 6);
    const titleClass = category === 'new' ? "text-[#FFD700]" : "text-white";
    summaryText.innerHTML = `<h3 class="text-xl font-bold ${titleClass}">${formattedName}</h3>`;

    summary.appendChild(summaryImgContainer);
    summary.appendChild(summaryText);

    // التفاصيل (Details) - الجزء المخفي
    const details = document.createElement("div");
    details.className = "item-details px-4 pb-4 space-y-4";

    const detailsImgContainer = document.createElement('div');
    const detailsImg = document.createElement('img');
    detailsImg.src = item.full_image_path;
    detailsImg.alt = item.name;
    detailsImg.className = `w-full aspect-square object-cover rounded-lg border-2 ${imgBorderClass}`;
    detailsImg.loading = 'lazy';
    detailsImg.onerror = handleImageError;
    detailsImgContainer.appendChild(detailsImg);
    details.appendChild(detailsImgContainer);

    if (item.description) {
        details.innerHTML += `<p class="text-white"><strong class="text-[#6dd9f3]">المكونات:</strong> ${item.description}</p>`;
    }
    
    const priceContainer = document.createElement('div');
    priceContainer.className = "price-container mt-2";
    const priceColor = category === 'new' ? "text-[#FFD700]" : "text-white";
    const highlightColor = category === 'new' ? "text-[#FFD700]" : "text-[#6dd9f3]";

    if (item.price2 !== undefined && item.price2 !== null) {
        priceContainer.innerHTML = `
            <div class="flex justify-start items-center gap-4">
                 <p class="text-xl font-bold ${priceColor}"><span class="font-medium text-gray-300">ج</span> ${item.price.toFixed(2)} :S</p>
                 <p class="text-xl font-bold ${priceColor}"><span class="font-medium text-gray-300">ج</span> ${item.price2.toFixed(2)} :M</p>
            </div>
        `;
    } else {
        priceContainer.innerHTML = `<p class="text-2xl font-bold ${highlightColor}">${item.price.toFixed(2)} ج</p>`;
    }
    
    details.appendChild(priceContainer);
    
    card.appendChild(summary);
    card.appendChild(details);

    // منطق التوسيع (Expand Logic)
    summary.onclick = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            const isCurrentlyExpanded = card.classList.contains('expanded');
            document.querySelectorAll(".item-card.expanded").forEach(c => {
                if (c !== card) c.classList.remove('expanded');
            });
            card.classList.toggle('expanded', !isCurrentlyExpanded);
        } else {
            // منطق الديسكتوب (يفتح الكارت والمقابل له في الشبكة)
            const allCardsInGrid = Array.from(card.parentElement.children);
            const currentIndex = allCardsInGrid.indexOf(card);
            let pairCard = null;
            
            // تحديد الكارت المقابل في الشبكة 2x2
            if (currentIndex % 2 === 0) {
                pairCard = allCardsInGrid[currentIndex + 1];
            } else {
                pairCard = allCardsInGrid[currentIndex - 1];
            }
            
            const isCurrentlyExpanded = card.classList.contains('expanded');
            document.querySelectorAll(".item-card.expanded").forEach(c => {
                if (c !== card && c !== pairCard) {
                    c.classList.remove('expanded');
                }
            });
            
            card.classList.toggle('expanded', !isCurrentlyExpanded);
            if (pairCard) {
                pairCard.classList.toggle('expanded', !isCurrentlyExpanded);
            }
        }
    };

    return card;
}

// --- وظائف وضع القراءة (Read Mode) ---

function toggleReadMode() {
    isReadMode = !isReadMode;
    
    if (isReadMode) {
        // تفعيل وضع القراءة
        menuContainer.classList.add('hidden');
        readModeContainer.classList.remove('hidden');
        
        // إخفاء زر "الأصناف"
        if(dropdownContainer) dropdownContainer.classList.add('hidden');

        // تغيير نص وأيقونة الزر
        const iconHtml = '<i class="fas fa-th-list"></i>';
        const buttonText = `<span>وضع الأعمدة</span>`; // تم التعديل
        
        if(readModeDesktopBtn) readModeDesktopBtn.innerHTML = `${iconHtml} ${buttonText}`;
        if(readModeMobileBtn) readModeMobileBtn.innerHTML = '🧱 وضع الأعمدة'; // في حال وجود زر موبايل منفصل

        // تحميل الصور
        if (readModeContainer.innerHTML.trim() === '') {
            loadReadModeImages();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } else {
        // العودة للوضع العادي
        menuContainer.classList.remove('hidden');
        readModeContainer.classList.add('hidden');
        
        if(dropdownContainer) dropdownContainer.classList.remove('hidden');

        const iconHtml = '<i class="fas fa-book-open"></i>';
        const buttonText = `<span>وضع القراءة</span>`; // تم التعديل
        
        if(readModeDesktopBtn) readModeDesktopBtn.innerHTML = `${iconHtml} ${buttonText}`;
        if(readModeMobileBtn) readModeMobileBtn.innerHTML = '📖 وضع القراءة';
    }
}

function loadReadModeImages() {
    const imagesCount = 5; // عدد الصور في مجلد القراءة
    let html = '';
    
    for (let i = 1; i <= imagesCount; i++) {
        // تحميل أول صورتين بسرعة (eager) والباقي عند الحاجة (lazy)
        const loadingType = i <= 2 ? 'eager' : 'lazy';
        // إضافة كلاسات لتحسين عرض الصور
        html += `<img src="${READ_MODE_PATH}/${i}.jpg" alt="قائمة صفحة ${i}" loading="${loadingType}" class="w-full h-auto rounded-lg shadow-lg mb-4 border border-gray-700">`;
    }
    
    readModeContainer.innerHTML = html;
}

// --- تحديث الأزرار والاتصال ---
function updateCallButton() {
    callNowBtn.href = branchPhoneNumbers[branchSelect.value] || '#';
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    loadAndProcessMenu();
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    updateCallButton();
});

// Dropdown Toggle
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', () => dropdownMenu.classList.toggle('hidden'));
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
    if (dropdownBtn && !dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
    }
});

branchSelect.addEventListener('change', updateCallButton);

// أزرار وضع القراءة
if (readModeDesktopBtn) readModeDesktopBtn.addEventListener('click', toggleReadMode);
if (readModeMobileBtn) readModeMobileBtn.addEventListener('click', toggleReadMode);

// Scroll Behavior (Header & Bottom Bar)
window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const isAtBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 50;

    // إخفاء/إظهار الهيدر
    if (currentScrollY < lastScrollY || currentScrollY < 100) {
        header.classList.remove("translate-y-[-100%]");
    } else {
        header.classList.add("translate-y-[-100%]");
    }

    // إخفاء/إظهار الشريط السفلي
    // يظهر فقط عند التمرير لأسفل أو الوصول للنهاية، ويختفي عند الصعود أو في أعلى الصفحة
    if (currentScrollY > lastScrollY && !isAtBottom) {
        bottomBar.classList.remove('visible'); // قد تحتاج لإضافة كلاس في CSS للتحكم بالظهور إذا لم يكن موجوداً
        bottomBar.style.transform = "translateY(100%)"; // استخدام التحويل مباشرة إذا لم يكن هناك كلاس
    } else {
        bottomBar.classList.add('visible');
        bottomBar.style.transform = "translateY(0)";
    }
    
    if (currentScrollY < 100) {
        bottomBar.style.transform = "translateY(100%)";
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
});