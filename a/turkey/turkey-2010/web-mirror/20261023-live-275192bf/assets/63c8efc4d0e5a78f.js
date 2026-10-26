/* ==========================================================================
 * TOBB ETÜ — Erişilebilirlik davranış katmanı (WCAG 2.2 Level A)
 * --------------------------------------------------------------------------
 * EKLEMELİ dosyadır: minified _min/main.js'e dokunmadan ARIA durum
 * yönetimini, klavye desteğini ve otomatik medya kontrolünü merkezîleştirir.
 * jQuery'den SONRA yüklenir. Mevcut görsel/işlevsel davranışı bozmaz;
 * yalnızca erişilebilirlik semantiği ve klavye/medya kontrolü ekler.
 * ========================================================================== */
(function () {
    'use strict';

    if (typeof window.jQuery === 'undefined') { return; }
    var $ = window.jQuery;

    /* Sayfa diline göre erişilebilir metinler (lang <html>'den okunur) */
    var lang = (document.documentElement.getAttribute('lang') || 'tr').slice(0, 2).toLowerCase();
    var L = (lang === 'en')
        ? { pause: 'Pause video', play: 'Play video', dateField: 'Reservation date', videoFrame: 'YouTube video player', more: 'More' }
        : { pause: 'Videoyu durdur', play: 'Videoyu oynat', dateField: 'Rezervasyon Tarihi', videoFrame: 'YouTube video oynatıcı', more: 'Daha fazla' };

    var ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
    var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>';

    /* ----------------------------------------------------------------------
     * Yardımcı: geç-üretilen (3. parti eklenti tarafından sonradan DOM'a
     * eklenen) bir öğe belirince callback'i BİR KEZ uygula. flatpickr alt-
     * input'u ve youmax iframe'i bu dosyanın DOM-ready'sinden SONRA inline
     * init scriptleriyle oluşur → düz querySelector boş döner. MutationObserver
     * ile öğeyi bekle; kısa zaman aşımıyla (~10 sn) gözlemciyi kapat (sızıntı yok).
     * ---------------------------------------------------------------------- */
    function whenPresent(selector, cb) {
        var existing = document.querySelector(selector);
        if (existing) { cb(existing); return; }
        if (typeof window.MutationObserver === 'undefined') { return; }
        var observer = new window.MutationObserver(function () {
            var el = document.querySelector(selector);
            if (el) { observer.disconnect(); clearTimeout(timer); cb(el); }
        });
        var timer = setTimeout(function () { observer.disconnect(); }, 10000);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    $(function () {

        /* ------------------------------------------------------------------
         * 1) role="button" taşıyan öğeleri klavyeyle çalışır kıl — WCAG 2.1.1
         * <span>/<div role="button"> için Enter+Space; <a> için yalnız Space
         * (Enter zaten doğal tetikler → çift tetiklemeyi önle).
         * ------------------------------------------------------------------ */
        $(document).on('keydown', '[role="button"]', function (e) {
            var tag = this.tagName.toLowerCase();
            if (tag === 'button') { return; } /* gerçek button her ikisini doğal yapar */
            var isSpace = (e.key === ' ' || e.key === 'Spacebar' || e.keyCode === 32);
            var isEnter = (e.key === 'Enter' || e.keyCode === 13);
            /* href taşıyan <a> (örn. href="javascript:;") Enter'ı doğal tetikler →
             * çift tetiklemeyi önlemek için Enter'ı yalnızca href YOK ise üstlen.
             * Space'i hiçbir <a> doğal yapmaz, onu her zaman üstlen. */
            var anchorNativeEnter = (tag === 'a' && this.hasAttribute('href'));
            if (isSpace) { e.preventDefault(); this.click(); }
            else if (isEnter && !anchorNativeEnter) { e.preventDefault(); this.click(); }
        });

        /* ------------------------------------------------------------------
         * 2) aria-expanded'ı GERÇEK duruma göre senkronla — WCAG 4.1.2
         * display tabanlı toggle eden açıcılar (header alt-menüleri:
         * $('#submenuX').toggle()) için kontrol edilen öğenin :visible
         * durumu güvenilirdir. #mobileNav ve .searchBtn ayrı ele alınır.
         * ------------------------------------------------------------------ */
        $(document).on('click', '[aria-controls][aria-expanded]', function () {
            if (this.id === 'mobileNav' || $(this).hasClass('searchBtn')) { return; }
            var id = this.getAttribute('aria-controls');
            var target = id ? document.getElementById(id) : null;
            if (target) {
                this.setAttribute('aria-expanded', $(target).is(':visible') ? 'true' : 'false');
            } else {
                this.setAttribute('aria-expanded',
                    this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            }
        });

        /* Yükleme anında aria-expanded'ı gerçek görünürlüğe göre düzelt.
         * Böylece şablonlara sabit aria-expanded="false" konabilir; başlangıçta
         * açık olan (aktif) alt-menüler otomatik "true" olarak işaretlenir. */
        $('[aria-controls][aria-expanded]').each(function () {
            if (this.id === 'mobileNav' || $(this).hasClass('searchBtn')) { return; }
            var id = this.getAttribute('aria-controls');
            var target = id ? document.getElementById(id) : null;
            if (target) {
                this.setAttribute('aria-expanded', $(target).is(':visible') ? 'true' : 'false');
            }
        });

        /* ------------------------------------------------------------------
         * 3) Mobil menü (slideout) — durum transform ile yönetildiğinden
         * :visible güvenilmez; tıklamada manuel çevir. WCAG 4.1.2
         * ------------------------------------------------------------------ */
        $('#mobileNav').on('click', function () {
            var open = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', open ? 'false' : 'true');
        });

        /* ------------------------------------------------------------------
         * 4) Arama açıcısı — açılır kutu .active sınıfı (opaklık) ile
         * yönetildiğinden basit ve güvenilir tıklama-çevirme kullan. WCAG 4.1.2
         * ------------------------------------------------------------------ */
        $('.searchBtn').on('click', function () {
            var open = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', open ? 'false' : 'true');
        });

        /* ------------------------------------------------------------------
         * 5) ARIA sekmeleri için ok-tuşu navigasyonu — WCAG 2.1.1
         * Yalnızca role="tablist" varsa çalışır; aksi halde no-op.
         * ------------------------------------------------------------------ */
        $('[role="tablist"]').each(function () {
            var $tabs = $(this).find('[role="tab"]');
            if ($tabs.length < 2) { return; }
            $tabs.on('keydown', function (e) {
                var i = $tabs.index(this), n = $tabs.length, j;
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown': j = (i + 1) % n; break;
                    case 'ArrowLeft':
                    case 'ArrowUp': j = (i - 1 + n) % n; break;
                    case 'Home': j = 0; break;
                    case 'End': j = n - 1; break;
                    default: return;
                }
                e.preventDefault();
                $tabs.eq(j).trigger('focus').trigger('click');
            });
        });

        /* ------------------------------------------------------------------
         * 6) Otomatik oynayan video için durdur/oynat düğmesi — WCAG 2.2.2
         * autoplay olan her <video>'ya görünür kontrol enjekte eder.
         * "Azaltılmış hareket" tercihinde otomatik durdurur.
         * ------------------------------------------------------------------ */
        $('video[autoplay]').each(function () {
            var video = this;
            var $wrap = $(video).parent();
            if (!$wrap.length) { return; }
            $wrap.addClass('a11y-media-wrap');

            var $btn = $('<button>', {
                'type': 'button',
                'class': 'a11y-media-toggle',
                'aria-label': L.pause,
                'html': ICON_PAUSE
            });

            $btn.on('click', function () {
                if (video.paused) {
                    video.play();
                    $btn.attr('aria-label', L.pause).html(ICON_PAUSE);
                } else {
                    video.pause();
                    $btn.attr('aria-label', L.play).html(ICON_PLAY);
                }
            });

            $wrap.append($btn);

            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                try { video.pause(); } catch (err) {}
                $btn.attr('aria-label', L.play).html(ICON_PLAY);
            }
        });

        /* ------------------------------------------------------------------
         * 7) flatpickr görünür tarih alanına erişilebilir isim — WCAG 4.1.2/3.3.2
         * altInput:true ile orijinal #rez_date gizlenir; görünür readonly
         * input'un yalnız placeholder'ı vardır (erişilebilir isim sayılmaz).
         * Görsel etiket .rezervasyon__date__input__label var ama <label for>
         * ile bağlı değil. Alt-input bizim ready'mizden sonra oluştuğu için
         * whenPresent ile bekle. İsmi görünür etiketten al, yoksa dil sabiti.
         * ------------------------------------------------------------------ */
        whenPresent('.rezervasyon__date input.flatpickr-input', function (el) {
            if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) { return; }
            var $label = $(el).closest('.rezervasyon__date').find('.rezervasyon__date__input__label');
            var text = ($label.length ? $.trim($label.text()) : '') || L.dateField;
            el.setAttribute('aria-label', text);
        });

        /* ------------------------------------------------------------------
         * 8) .tabs__title sözde-link sekmeleri — tümünü klavyeyle erişilebilir
         * kıl. Şablonda yalnız AKTİF sekme statik role="link"+tabindex="0"
         * alıyor; pasif sekme almıyor (WCAG 4.1.2). Ayrıca <div onclick>
         * Enter'ı doğal tetiklemediğinden aktif sekme bile klavyeyle çalışmıyor
         * (WCAG 2.1.1). Hepsini normalize et + Enter/Space → click.
         * Gerçek <a> sekmeler atlanır (çift-tetik/gereksiz-role önlenir).
         * ------------------------------------------------------------------ */
        $('.tabs__title').each(function () {
            if (this.tagName.toLowerCase() === 'a') { return; }
            if (!this.getAttribute('role')) { this.setAttribute('role', 'link'); }
            if (this.getAttribute('tabindex') === null) { this.setAttribute('tabindex', '0'); }
        });
        $(document).on('keydown', '.tabs__title', function (e) {
            if (this.tagName.toLowerCase() === 'a') { return; } /* gerçek link Enter'ı doğal yapar */
            var isSpace = (e.key === ' ' || e.key === 'Spacebar' || e.keyCode === 32);
            var isEnter = (e.key === 'Enter' || e.keyCode === 13);
            if (isSpace || isEnter) { e.preventDefault(); this.click(); }
        });

        /* ------------------------------------------------------------------
         * 9) youmax video lightbox iframe'ine erişilebilir isim — WCAG 4.1.2
         * _video.js #youmax-video-lightbox iframe'ini (title'sız) sayfa
         * yüklenince gizli ekler; bizim ready'mizden sonra oluşabilir →
         * whenPresent ile bekle.
         * ------------------------------------------------------------------ */
        whenPresent('#youmax-video-lightbox', function (el) {
            if (!el.getAttribute('title')) { el.setAttribute('title', L.videoFrame); }
        });

        /* ------------------------------------------------------------------
         * 10) Aday Öğrenci üst sekme menüsü — "priority+" taşma menüsü
         * .aday_menu__big (8 sekme) yalnızca ~1560px+ tek satıra sığar; 1024–1560
         * arası kırılıp kırılan sekme beyaz alt-menü (.aday_menu__small) altında
         * kalıyordu (main.css/media.css'te bu aralık için big-menü genişlik
         * stratejisi yok). Sığmayan sekmeleri sondan başlayarak (AKTİF sekme
         * atlanır) bir "Daha fazla" açılır menüsüne taşı → bar hep TEK satır.
         * Dile göre kendini ayarlar. >=768px çalışır (768–1023 aralığı
         * accessibility.css Bölüm 7 ile native table-layout'tan inline-block'a
         * döndürülür); <768px native akordiyona bırakılır. Klavye Bölüm 1'den gelir (toggle
         * role="button", href yok -> Enter+Space). Görünüm accessibility.css
         * Bölüm 7'de. WCAG 2.1.1 / 4.1.2.
         * ------------------------------------------------------------------ */
        (function () {
            var ul = document.querySelector('.aday_menu .aday_menu__big');
            if (!ul) { return; }
            var items = [].slice.call(ul.querySelectorAll('.aday_menu__big__item'))
                .filter(function (li) { return !$(li).hasClass('aday_menu__more'); });
            if (items.length < 3) { return; }

            var moreLi = document.createElement('li');
            moreLi.className = 'aday_menu__big__item aday_menu__more';
            moreLi.innerHTML =
                '<a class="aday_menu__more__toggle" role="button" tabindex="0" ' +
                'aria-haspopup="true" aria-expanded="false">' +
                '<span>' + L.more + '</span>' +
                '<span class="aday_menu__more__caret" aria-hidden="true"></span></a>' +
                '<ul class="aday_menu__more__list" role="menu"></ul>';
            ul.appendChild(moreLi);
            var subUl = moreLi.querySelector('.aday_menu__more__list');
            var toggle = moreLi.querySelector('.aday_menu__more__toggle');

            /* Bar tek satırda mı? Görünür tüm üst-düzey öğelerin rect.top'unu
             * karşılaştır (aktif sekmenin top:-30px pop-out'u <li>'yi kaydırmaz). */
            function fits() {
                var vis = [].slice.call(ul.children).filter(function (li) {
                    return li.offsetParent !== null;
                });
                if (vis.length < 2) { return true; }
                var t0 = vis[0].getBoundingClientRect().top;
                for (var i = 1; i < vis.length; i++) {
                    if (Math.abs(vis[i].getBoundingClientRect().top - t0) > 4) { return false; }
                }
                return true;
            }
            function closeMore() {
                $(moreLi).removeClass('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
            function reflow() {
                /* 1) tüm sekmeleri bara geri al, More'u gizle */
                items.forEach(function (li) { ul.insertBefore(li, moreLi); });
                moreLi.style.display = 'none';
                closeMore();
                /* 2) yalnız <768px'te native akordiyona bırak; 768–1023 aralığı
                 *    accessibility.css Bölüm 7 ile inline-block'a döndürülür → More sürer */
                if (window.innerWidth < 768) { return; }
                if (fits()) { return; }
                /* 3) sondan başlayarak (aktifi atlayarak) sığana dek More'a taşı */
                moreLi.style.display = '';
                for (var i = items.length - 1; i >= 0; i--) {
                    if (fits()) { break; }
                    if ($(items[i]).hasClass('active')) { continue; }
                    subUl.insertBefore(items[i], subUl.firstChild);
                }
            }

            $(toggle).on('click', function (e) {
                e.preventDefault();
                var open = $(moreLi).toggleClass('is-open').hasClass('is-open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            /* dışarı tıklama + Escape ile kapan */
            $(document).on('click', function (e) {
                if (!moreLi.contains(e.target)) { closeMore(); }
            });
            $(document).on('keydown', function (e) {
                if (e.key === 'Escape' || e.keyCode === 27) { closeMore(); }
            });

            var rt;
            $(window).on('resize', function () { clearTimeout(rt); rt = setTimeout(reflow, 150); });
            $(window).on('load', reflow); /* geç yüklenen font/ikon genişlik kaymasını yakala */
            reflow();
        })();

    });
})();
