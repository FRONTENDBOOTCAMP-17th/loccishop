export function getRitualStepsTemplate() {
  return `
    <section
  class="w-full mx-auto max-w-7xl px-4 lg:px-8 flex flex-col items-center my-16 lg:my-32"
>
  <header class="flex flex-col items-center pb-8 gap-9 w-full">
    <h2
      id="ritual-title"
      class="text-3xl lg:text-5xl font-semibold leading-12 uppercase text-center break-keep"
    ></h2>
    <p
      id="ritual-description"
      class="text-base lg:text-xl leading-7 text-center break-keep"
    ></p>
  </header>
  <ul
    id="ritual-steps-list"
    class="flex flex-col lg:flex-row justify-center gap-6 list-none w-full items-stretch px-4 lg:px-0"
  ></ul>
</section>

  `;
}