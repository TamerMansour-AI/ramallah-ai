import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// إعداد الاتصال بـ Supabase
const supabase = createClient(
  'https://mclcwqoecszpctglwwxz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbGN3cW9lY3N6cGN0Z2x3d3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NTI2MDUsImV4cCI6MjA2MTUyODYwNX0.LuAyKXuDmt9afXzy-jaAtdMUKEOx0woxr5dTs0Yd0cs'
);

// الأقسام الموجودة في الصفحة
const sections = ['images', 'music', 'videos', 'blogs', 'books'];
let allItems = [];

// تحميل البيانات من Supabase
async function fetchData() {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('status', 'approved')
    .order('created', { ascending: false });

  if (error) {
    console.error('❌ Error loading data:', error);
    return;
  }

  allItems = data;
  renderFiltered();
}

// تصفية البيانات حسب البحث والفلترة
function renderFiltered() {
  const searchValue = document.getElementById('search-input')?.value?.toLowerCase() || '';
  const selectedType = document.getElementById('type-filter')?.value || '';

  sections.forEach(section => {
    const container = document.querySelector(`#${section} .gallery-grid`);
    if (!container) return;

    container.innerHTML = '';

    const filtered = allItems.filter(item => {
      const matchesType = selectedType ? item.type === selectedType : true;
      const matchesSearch =
        item.title?.toLowerCase().includes(searchValue) ||
        item.creator?.toLowerCase().includes(searchValue);
      return item.type === section && matchesType && matchesSearch;
    });

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-card show';
      card.innerHTML = `
        ${item.thumb ? `<img src="${item.thumb}" alt="${item.title}" loading="lazy">` : ''}
        <div class="gallery-meta">By <b>${item.creator}</b></div>
        <div class="gallery-title">${item.title}</div>
        <div class="gallery-desc">${item.description || ''}</div>
        ${item.link ? `<a href="${item.link}" target="_blank">🔗 View Work</a>` : ''}
      `;
      container.appendChild(card);
    });
  });
}

// الأحداث على عناصر البحث والفلترة
document.addEventListener('DOMContentLoaded', () => {
  fetchData();

  const search = document.getElementById('search-input');
  const filter = document.getElementById('type-filter');

  if (search) search.addEventListener('input', renderFiltered);
  if (filter) filter.addEventListener('change', renderFiltered);
});
