

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Zambezi Futures | Player Registration</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;700;800;900&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#012d1d", // Brand Green
                        "secondary": "#775a19", // Brand Gold
                        "on-primary": "#ffffff",
                        "surface": "#f8f9fa",
                        "surface-container": "#edeeef",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-highest": "#e1e3e4",
                        "on-surface": "#191c1d",
                        "on-surface-variant": "#524348",
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    fontFamily: {
                        "headline": ["Lexend"],
                        "body": ["Plus Jakarta Sans"],
                        "label": ["Plus Jakarta Sans"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-header {
            backdrop-filter: blur(24px);
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0.5);
            padding: 5px;
            cursor: pointer;
        }
        body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        main {
            flex: 1;
        }
    </style>
</head>
<body class="bg-surface font-body text-on-surface antialiased">
<!-- TopAppBar Shared Component -->
<header class="fixed top-0 w-full z-50 bg-[#012d1d] h-20 shadow-2xl shadow-[#191c1d]/10 flex justify-between items-center px-6 md:px-12">
<div class="flex items-center gap-4 max-w-7xl mx-auto w-full justify-between">
<div class="flex items-center gap-4">
<button class="text-white active:scale-95 duration-200 transition-colors">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<span class="text-xl font-bold text-white font-headline tracking-tight">REGISTRATION</span>
</div>
<div class="flex items-center gap-3">
<div class="hidden md:flex items-center gap-6 mr-6">
<a class="text-white/80 hover:text-white text-xs font-headline uppercase tracking-widest transition-colors" href="#">Players</a>
<a class="text-white/80 hover:text-white text-xs font-headline uppercase tracking-widest transition-colors" href="#">Programs</a>
</div>
<div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
<img alt="Zambezi Futures Logo" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ugaEWlfludEWYT30EW0gwxyyvxBAC33od3lsr3O3gU425JSsP5aGPDJzDAt6fj2KmJLvSFTOi_7Ra8fkB0vW4mYTlhj8NZlOkaJwZa9uTTR9CRn-3nFMgqaUotiE2GRtzoimtk32I_QmpNIqEKMe4AlGNL2FzGjXuER7U3ndEI3L9y2H1q2DpkkveotnHTvtA2QoaflFTZb0xJimqJHcMaLEAjLxwI-74iPsr_DhaXfqogRp6Kbs8an4GSeNdU2jCZ7IQjPSRSdW3A"/>
</div>
</div>
</div>
</header>
<main class="pt-28 pb-20 px-4 w-full">
<div class="max-w-2xl mx-auto">
<!-- Hero Section -->
<div class="relative mb-8 overflow-hidden rounded-xl bg-[#012d1d] p-8 md:p-12 min-h-[220px] md:min-h-[280px] flex flex-col justify-center">
<div class="relative z-10">
<span class="inline-block bg-[#775a19] text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6">Official Portal</span>
<h1 class="text-4xl md:text-5xl font-black font-headline text-white mb-4 leading-tight tracking-tighter">FUEL THE FUTURE</h1>
<div class="mb-6 flex items-center gap-3">
<div class="h-10 w-1 bg-[#775a19] rounded-full"></div>
<img alt="Zambezi Futures" class="h-10 w-auto brightness-0 invert opacity-90" src="https://lh3.googleusercontent.com/aida/ADBb0ugaEWlfludEWYT30EW0gwxyyvxBAC33od3lsr3O3gU425JSsP5aGPDJzDAt6fj2KmJLvSFTOi_7Ra8fkB0vW4mYTlhj8NZlOkaJwZa9uTTR9CRn-3nFMgqaUotiE2GRtzoimtk32I_QmpNIqEKMe4AlGNL2FzGjXuER7U3ndEI3L9y2H1q2DpkkveotnHTvtA2QoaflFTZb0xJimqJHcMaLEAjLxwI-74iPsr_DhaXfqogRp6Kbs8an4GSeNdU2jCZ7IQjPSRSdW3A"/>
</div>
<p class="text-white/70 text-sm md:text-base font-medium">Player Registration Center</p>
</div>
<!-- Dynamic Soccer Player Background Integration -->
<div class="absolute right-0 top-0 bottom-0 w-full md:w-3/4 opacity-30 md:opacity-40 mix-blend-overlay pointer-events-none">
<img alt="Dynamic soccer player" class="w-full h-full object-cover object-center translate-x-12" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHX-XvG8G9p99z6fQYxH9o4P298G78_n3uY9_zP9yL0Z9C-9Z3qH_B_R-Y_7=s1024"/>
</div>
<!-- Decorative Ball -->
<div class="absolute -right-12 -bottom-12 w-48 h-48 md:w-64 md:h-64 opacity-20 pointer-events-none">
<img alt="close up of a professional soccer ball" class="w-full h-full object-contain rotate-12" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzJ7DE4TD0SezpYJt-FsX5xn1Yg9mC6AZQp0sOcxHX8obbIjJDK5fZbeP2AdfHWNSr3kv-OsXGHIGanAhuRO-sM1KrkUmG0pWmkSyI1_HZLdrS-uXTgY1l6p-jhXDpHf4nS-rvpIW0sSEwv7KLuPjm7XF4GRfVokOhwtlYr7K-eJkUi0v55ag5p732Q6FKzQWy_6EWk4gBsduvnKJQmkNtMMe2xHLaLyXFgBGelcZppVT3glzDna0Ns9AhM-SJ9btDa6lV2GUnZCdD"/>
</div>
</div>
<!-- Registration Form Card -->
<section class="bg-surface-container-lowest rounded-xl p-6 md:p-10 shadow-2xl relative border-b-8 border-[#775a19]">
<form class="space-y-8">
<!-- Player Portrait Section -->
<div class="space-y-4">
<label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#012d1d] px-1">Player Portrait (Preview)</label>
<div class="flex flex-col sm:flex-row items-center gap-6 p-4 bg-surface rounded-xl border border-surface-container-highest">
<div class="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-lg overflow-hidden relative group shrink-0">
<img alt="Player Preview" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJjsNtbSEorhc9JG0KhRVduefzjya3Udt8NU4CvsCUqsusbokhQdPN6i_YV2HEcmaphOSlPCiHP02-WjWSc_pmvQ5qyYjIu7eV8YZQMFUStVZcfzNfQ_VqQ9OilTZdNdJHtHErHunuD0qvgXtoKAsGN3k8idXhBDEI48F53fVFbqmGpD7ak7jHJV03mfFhvA6TkCpuZbkOZTDd006f0mqtGbGDUix1DCn7LSWZThfRdmn8b2kvZ4zwTus5KfxISJZ8khi4WIGWmvMO"/>
<div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
<span class="material-symbols-outlined text-white text-3xl">edit</span>
</div>
</div>
<div class="flex-1 text-center sm:text-left">
<p class="text-xs md:text-sm text-stone-500 font-medium leading-relaxed mb-4">Portrait uploaded successfully. This image will appear on your official Athlete ID.</p>
<div class="flex justify-center sm:justify-start gap-4">
<button class="text-[10px] md:text-xs font-bold uppercase text-[#775a19] hover:text-[#5a4413] flex items-center gap-1 transition-colors" type="button">
<span class="material-symbols-outlined text-sm">refresh</span> Change
                                </button>
<button class="text-[10px] md:text-xs font-bold uppercase text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors" type="button">
<span class="material-symbols-outlined text-sm">delete</span> Remove
                                </button>
</div>
</div>
</div>
</div>
<!-- Personal Information Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-500 px-1">First Name</label>
<input class="w-full bg-surface-container-highest border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-stone-400 focus:ring-2 focus:ring-[#775a19] transition-all font-medium" placeholder="First Name" type="text"/>
</div>
<div class="space-y-2">
<label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-500 px-1">Middle (Other)</label>
<input class="w-full bg-surface-container-highest border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-stone-400 focus:ring-2 focus:ring-[#775a19] transition-all font-medium" placeholder="Middle Name" type="text"/>
</div>
<div class="md:col-span-2 space-y-2">
<label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-500 px-1">Last Name</label>
<div class="relative">
<input class="w-full bg-surface-container-highest border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-stone-400 focus:ring-2 focus:ring-[#775a19] transition-all font-medium" placeholder="Last Name" type="text"/>
<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">person</span>
</div>
</div>
</div>
<!-- Details Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-500 px-1">Date of Birth</label>
<input class="w-full bg-surface-container-highest border-none rounded-lg py-4 px-4 text-on-surface focus:ring-2 focus:ring-[#775a19] transition-all font-medium" type="date"/>
</div>
<div class="space-y-2">
<label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-500 px-1">Age Group</label>
<div class="relative">
<select class="w-full bg-surface-container-highest border-none rounded-lg py-4 px-4 text-on-surface focus:ring-2 focus:ring-[#775a19] transition-all font-medium appearance-none">
<option disabled="" selected="" value="">Select Age Group</option>
<option>U-10</option>
<option>U-12</option>
<option>U-14</option>
<option>U-16</option>
<option>U-18</option>
</select>
<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">expand_more</span>
</div>
</div>
</div>
<!-- Facility & Attachment Information -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-500 px-1">Academy</label>
<div class="relative">
<input class="w-full bg-surface-container-highest border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-stone-400 focus:ring-2 focus:ring-[#775a19] transition-all font-medium" placeholder="Assigned facility" type="text"/>
<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">stadium</span>
</div>
</div>
<div class="space-y-2">
<label class="block text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-500 px-1">Attachment Upload</label>
<div class="relative">
<label class="flex items-center justify-between w-full bg-surface-container-highest border-none rounded-lg py-3.5 px-4 text-stone-400 cursor-pointer hover:bg-surface-container-highest/80 transition-all">
<span class="text-sm font-medium truncate">Birth Certificate or Waiver</span>
<span class="material-symbols-outlined text-lg">upload_file</span>
<input class="hidden" type="file"/>
</label>
</div>
</div>
</div>
<!-- Action Button -->
<div class="pt-6">
<button class="w-full text-white font-headline font-black py-5 rounded-xl uppercase tracking-widest shadow-xl shadow-[#775a19]/20 hover:shadow-[#775a19]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 bg-[#775a19] group" type="submit">REGISTER <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span></button>
</div>
</form>
</section>
<!-- Support Hint -->
<div class="mt-10 flex gap-6 p-6 bg-white/50 rounded-xl border border-surface-container">
<div class="w-1.5 bg-[#775a19] self-stretch rounded-full"></div>
<div class="flex-1">
<p class="font-headline text-sm font-bold uppercase text-[#012d1d] tracking-tight mb-2">Need Support?</p>
<p class="text-xs md:text-sm text-stone-600 leading-relaxed">Visit our athlete help desk for technical assistance with Zambezi Futures registration. Available 24/7 for elite program members.</p>
</div>
</div>
</div>
</main>
<!-- Footer Shared Component -->
<footer class="bg-surface-container-lowest w-full py-16 px-6 border-t border-black/5 mt-auto">
<div class="flex flex-col items-center gap-10 w-full max-w-7xl mx-auto">
<div class="text-2xl font-bold text-[#012d1d] font-headline tracking-tighter">ZAMBEZI FUTURES</div>
<div class="flex flex-wrap justify-center gap-x-10 gap-y-4">
<a class="font-headline text-xs uppercase tracking-widest text-stone-500 hover:text-[#775a19] hover:underline decoration-[#775a19] underline-offset-8 transition-all" href="#">Privacy Policy</a>
<a class="font-headline text-xs uppercase tracking-widest text-stone-500 hover:text-[#775a19] hover:underline decoration-[#775a19] underline-offset-8 transition-all" href="#">Terms of Service</a>
<a class="font-headline text-xs uppercase tracking-widest text-stone-500 hover:text-[#775a19] hover:underline decoration-[#775a19] underline-offset-8 transition-all" href="#">Athlete Handbook</a>
<a class="font-headline text-xs uppercase tracking-widest text-stone-500 hover:text-[#775a19] hover:underline decoration-[#775a19] underline-offset-8 transition-all" href="#">Support</a>
</div>
<div class="font-headline text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-400 text-center border-t border-surface-container pt-8 w-full max-w-md">
            © 2024 Zambezi Futures. Elite Athletic Editorial.
        </div>
</div>
</footer>
</body></html>