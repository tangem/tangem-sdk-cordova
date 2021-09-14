window.customElements.define('capacitor-welcome', class extends HTMLElement {
	constructor() {
		super();

		const root = this.attachShadow({mode: 'open'});

		root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      .area {
        width: 90%;
        height: 60vh;
      }
      main {
        padding: 15px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>TangemSdk</h1>
      </capacitor-welcome-titlebar>
      <main>
        <p>
          This demo shows how to call TangemSdk plugins. Say cheese!!!
        </p>

        <p><button class="button" id="scan-card">Scan card</button></p>
        <p><button class="button" id="sign">Sign</button></p>
        <textarea class="area" id="log"></textarea>   
      </main>
    </div>
    `
	}

	connectedCallback() {
		const self = this;

		let cardId;
		let walletPublicKey;

		function setLog(result, error) {
			const text = self.shadowRoot.querySelector('#log');
			text.value = JSON.stringify(result || error);
		}

		function callback() {
			return function (result, error) {
				setLog(result, error);
			}
		}

		self.shadowRoot.querySelector('#scan-card')
			.addEventListener('click', async function (e) {
				TangemSdk.scanCard(undefined, function (result, error) {
					setLog(result, error);
					if (result) {
						cardId = result.cardId;
						if (result.wallets.length > 0) {
							walletPublicKey = result.wallets[0].publicKey;
						}
					}
				});
			})
		self.shadowRoot.querySelector('#sign')
			.addEventListener('click', async function (e) {
				TangemSdk.sign(
					["44617461207573656420666f722068617368696e67", "44617461207573656420666f722068617368696e67"],
					walletPublicKey,
          undefined,
					cardId,
					undefined,
					callback
				);
			})
	}
});

window.customElements.define('capacitor-welcome-titlebar', class extends HTMLElement {
	constructor() {
		super();
		const root = this.attachShadow({mode: 'open'});
		root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
	}
});
