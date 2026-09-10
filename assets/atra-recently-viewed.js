/* Atra - "recently viewed" strip. Product handles live in localStorage on the
   visitor's device; each card is rendered by Shopify via sections/atra-product-card. */
if (!customElements.get('atra-recently-viewed')) {
  customElements.define(
    'atra-recently-viewed',
    class AtraRecentlyViewed extends HTMLElement {
      static get storageKey() {
        return 'atra:recent';
      }

      connectedCallback() {
        const current = this.dataset.current;
        const limit = parseInt(this.dataset.limit, 10) || 5;
        let handles = this.read();

        if (current) {
          handles = [current].concat(handles.filter((h) => h !== current)).slice(0, 12);
          this.write(handles);
        }

        const toShow = handles.filter((h) => h !== current).slice(0, limit);
        if (!toShow.length) {
          this.remove();
          return;
        }
        this.render(toShow);
      }

      read() {
        try {
          const raw = localStorage.getItem(AtraRecentlyViewed.storageKey);
          const list = raw ? JSON.parse(raw) : [];
          return Array.isArray(list) ? list.filter((h) => typeof h === 'string') : [];
        } catch (e) {
          return [];
        }
      }

      write(list) {
        try {
          localStorage.setItem(AtraRecentlyViewed.storageKey, JSON.stringify(list));
        } catch (e) {
          /* storage unavailable - fine */
        }
      }

      render(handles) {
        const list = this.querySelector('[data-atra-recent-list]');
        const rootUrl = this.dataset.root.endsWith('/') ? this.dataset.root : `${this.dataset.root}/`;
        const requests = handles.map((handle) =>
          fetch(`${rootUrl}products/${encodeURIComponent(handle)}?section_id=atra-product-card`)
            .then((r) => (r.ok ? r.text() : ''))
            .catch(() => '')
        );

        Promise.all(requests).then((htmls) => {
          let count = 0;
          htmls.forEach((html) => {
            if (!html) return;
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const card = doc.querySelector('.card-wrapper');
            if (!card) return;
            const li = document.createElement('li');
            li.className = 'grid__item';
            li.appendChild(card);
            list.appendChild(li);
            count += 1;
          });
          if (count === 0) {
            this.remove();
            return;
          }
          this.hidden = false;
        });
      }
    }
  );
}
