window.customElements.define('capacitor-welcome', class extends HTMLElement {
  constructor() {
    super();

    Capacitor.Plugins.SplashScreen.hide();
    
    const root = this.attachShadow({ mode: 'open' });

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
          This demo shows how to call TangemSdk plugins. Say cheese!
        </p>

        <p><button class="button" id="scan-card">Scan card</button></p>
        <p><button class="button" id="sign">Sign</button></p>

      </main>
    </div>
    `
  }

  connectedCallback() {
    const self = this;

    var cid = "BB03000000000004";
    var callback = {
        success: function(result) {
            console.log("result: " + JSON.stringify(result));
        },
        error: function(error) {
            console.log("error: " + JSON.stringify(error));
        }
    }

    self.shadowRoot.querySelector('#scan-card')
        .addEventListener('click', async function(e) {
            TangemSdk.scanCard(callback);
        })
    self.shadowRoot.querySelector('#sign')
        .addEventListener('click', async function(e) {
            TangemSdk.sign(callback, cid, ["44617461207573656420666f722068617368696e67", "44617461207573656420666f722068617368696e67"]);
        })
  }
});

window.customElements.define('capacitor-welcome-titlebar', class extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
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
