/* Atra - re-render the in-store stock box when the variant changes.
   Depends on Dawn's pubsub.js (subscribe, PUB_SUB_EVENTS) which theme.liquid loads first. */
if (!customElements.get('atra-store-stock')) {
  customElements.define(
    'atra-store-stock',
    class AtraStoreStock extends HTMLElement {
      connectedCallback() {
        if (typeof subscribe !== 'function' || typeof PUB_SUB_EVENTS === 'undefined') return;
        this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
          const variant = event && event.data && event.data.variant;
          if (!variant) {
            this.innerHTML = '';
            return;
          }
          if (String(variant.id) === this.dataset.variantId) return;
          this.dataset.variantId = variant.id;
          this.fetchAvailability(variant.id);
        });
      }

      disconnectedCallback() {
        if (this.unsubscribe) this.unsubscribe();
      }

      fetchAvailability(variantId) {
        const rootUrl = this.dataset.rootUrl.endsWith('/') ? this.dataset.rootUrl : `${this.dataset.rootUrl}/`;
        const url = `${rootUrl}variants/${variantId}/?section_id=atra-store-stock`;
        this.classList.add('atra-stock-wrapper--loading');
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const section = doc.querySelector('.shopify-section');
            this.innerHTML = section ? section.innerHTML : '';
          })
          .catch(() => {
            this.innerHTML = '';
          })
          .finally(() => this.classList.remove('atra-stock-wrapper--loading'));
      }
    }
  );
}
