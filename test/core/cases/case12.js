export const title       = '12) Simple'
export const description = `A componente without UI`;

export async function script () {
  const wait                      = t => new Promise(resolve => setTimeout(resolve, t));
  const {Simple, CONTEXT, define} = await import('/src/core/simple.js');

  class MyComponent extends Simple {

    async load () {
      const ctx = this [CONTEXT];
      const ref = document.querySelector(ctx.href);
      await wait(2000);
      ref.innerHTML = 'hello Grapper';
    }

  }

  define(MyComponent)
    .attr({name : 'delay', type : 'number', value : 0, posUpdate : 'load'})
    .attr({name : 'href', type : 'string', value : ''})
    .tag('my-component');
}

export default `
<my-component href="#content"></my-component>
<button id="update" onclick="document.querySelector('my-component').delay=1">load</button>
<div id="content"></div>
`;