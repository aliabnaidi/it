(() => {
  const launch = document.getElementById('raaPlatformBtn');
  if (!launch) return;
  const logo = launch.querySelector('.raa-logo');
  const fallback = launch.querySelector('.raa-logo-fallback');
  const logoFailed = () => { logo.hidden = true; fallback.hidden = false; };
  logo.addEventListener('error', logoFailed);
  if (logo.complete && !logo.naturalWidth) logoFailed();
  const links = [
    ['الموقع الإلكتروني', 'المواد والشروحات', 'https://pwrs-learn.pro/', '↗'],
    ['قناة يوتيوب', 'شروحات ومحاضرات', 'https://www.youtube.com/@programmingwithrs8163', '▷'],
    ['بوت التليجرام', 'الوصول إلى المواد والملفات', 'https://t.me/RaaAcademyBot', '⌘'],
    ['قناة التليجرام', 'أخبار المنصة والمحتوى الجديد', 'https://t.me/M_RZ_One', '✦'],
    ['Instagram', 'تابع منصة RAA', 'https://www.instagram.com/raaacademy/', '◎']
  ];
  launch.addEventListener('click', () => {
    const cards = links.map(([name, description, url, mark]) => `<a class="raa-link" href="${url}" target="_blank" rel="noopener noreferrer"><span class="raa-link-mark" aria-hidden="true">${mark}</span><span><strong>${name}</strong><small>${description}</small></span><span class="raa-link-arrow" aria-hidden="true">↗</span></a>`).join('');
    openPanel('منصة RAA', '/ RAA ACADEMY', `<p class="raa-intro">مواد وشروحات ومراجعات لطلاب IT. اختر الوجهة المناسبة للوصول إلى محتوى المنصة والتواصل معها.</p><div class="raa-links">${cards}</div><div class="raa-contact"><span>للتواصل مع مدير المنصة</span><a href="tel:+962779375624" dir="ltr">0779375624</a></div>`);
  });
})();
