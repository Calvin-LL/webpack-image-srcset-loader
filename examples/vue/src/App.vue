<template>
  <div>
    <img
      style="width: 50vw"
      src="@/assets/Macaca_nigra_self-portrait_large.jpg"
      :srcset="
        require('@/assets/Macaca_nigra_self-portrait_large.jpg?srcset&quality=90')
      "
    />

    <!-- for modern browsers: -->
    <picture>
      <source
        type="image/webp"
        :srcset="
          require('@/assets/Macaca_nigra_self-portrait_large.jpg?srcset&format=webp&quality=90')
        "
      />
      <source
        type="image/jpeg"
        :srcset="
          require('@/assets/Macaca_nigra_self-portrait_large.jpg?srcset&quality=90')
        "
      />
      <img
        style="width: 50vw"
        src="@/assets/Macaca_nigra_self-portrait_large.jpg"
      />
    </picture>
  </div>
</template>
