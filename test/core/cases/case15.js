export const title       = '15) create an web componente alias';
export const description = `add a web-component alias to the global scope`;

export async function script () {
  const {Base, define, ONCONNECT, ONDISCONNECT} = await import('/src/core/base.js');

  class MyComponent extends Base {

    #message = 'loading...';

    [Base.RENDER] () {
      this.shadowRoot.innerHTML = `
        <h1>${ this.tagName }</h1>
      `;
    }

  }

  define(MyComponent)
    .tag('my-component')
    .alias('second-component');

}



export default `
<div id="container">
  <my-component></my-component>
  <second-component></second-component>
</div>
`;