<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title inertia>Pemantauan &amp; Pengelolaan PJP</title>
        <meta name="description" content="Aplikasi pemantauan dan pengelolaan Perusahaan Jasa Pertambangan (PJP)" />
        <link rel="icon" type="image/png" sizes="256x256" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />

        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
