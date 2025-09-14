export const title       = '10) CSS'
export const description = `CSS properties and related functions with Extra class`;

export async function script () {
  const {Extra, RENDER, define}                 = await import('/src/core/extra.js');
  const {getCSSVar, getCSSPropertyDescriptors} = await import('/src/core/cssprops.js');

  class MyComponent extends Extra {

    [RENDER] () {
      this.shadowRoot.innerHTML = `
            <style>
            :host {
                display: block;
                width: 64px;
                height: 64px;
                background-color: ${ getCSSVar(this, 'bg-color') };
                color: ${ getCSSVar(this, 'fg-color') };
            }
            </style>
            G
        `;
    }
  }

  define(MyComponent)
    .style({name : 'bg-color', initialValue : 'red'})
    .style({name : 'fg-color', initialValue : 'white'})
    .tag('my-component');

  const component = document.querySelector('#component');
  const result    = document.querySelector('#result');
  const check     = document.querySelector('#check');
  check.addEventListener('click', () => {
    const descriptors = getCSSPropertyDescriptors(component);
    result.innerHTML  = JSON.stringify(descriptors, null, 2).replaceAll('<', '&lt;');
  });


}

export default `
<my-component id="component"></my-component>
<p>
  <button id="check">get CSS properties</button>
</p>
<pre id="result"></pre>

`;