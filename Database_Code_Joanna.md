<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Academy Registry Database | The Kinetic Archive</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;700;800;900&amp;family=Manrope:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "on-error": "#ffffff",
                      "inverse-primary": "#9cd3aa",
                      "on-secondary-fixed": "#261900",
                      "surface-variant": "#e1e3e1",
                      "tertiary": "#26241e",
                      "surface-container": "#eceeec",
                      "surface-bright": "#f8faf8",
                      "on-tertiary-container": "#a7a29a",
                      "surface": "#f8faf8",
                      "inverse-surface": "#2e3130",
                      "tertiary-fixed": "#e8e2d9",
                      "on-primary": "#ffffff",
                      "error-container": "#ffdad6",
                      "tertiary-container": "#3c3933",
                      "primary-fixed": "#b8f0c5",
                      "primary": "#002a13",
                      "inverse-on-surface": "#eff1ef",
                      "background": "#f8faf8",
                      "secondary-fixed": "#ffdea5",
                      "surface-container-high": "#e6e9e7",
                      "on-secondary-fixed-variant": "#5d4201",
                      "on-secondary": "#ffffff",
                      "on-primary-fixed": "#00210e",
                      "on-tertiary": "#ffffff",
                      "secondary-fixed-dim": "#e9c176",
                      "outline-variant": "#c0c9bf",
                      "secondary": "#775a19",
                      "on-primary-container": "#7aaf88",
                      "on-surface": "#191c1b",
                      "primary-container": "#0b4224",
                      "surface-container-highest": "#e1e3e1",
                      "on-tertiary-fixed-variant": "#494640",
                      "on-tertiary-fixed": "#1d1b16",
                      "surface-container-low": "#f2f4f2",
                      "on-error-container": "#93000a",
                      "on-secondary-container": "#785a1a",
                      "outline": "#717971",
                      "tertiary-fixed-dim": "#cbc6bd",
                      "error": "#ba1a1a",
                      "surface-container-lowest": "#ffffff",
                      "secondary-container": "#fed488",
                      "on-surface-variant": "#414942",
                      "surface-dim": "#d8dad9",
                      "surface-tint": "#366947",
                      "on-background": "#191c1b",
                      "on-primary-fixed-variant": "#1d5031",
                      "primary-fixed-dim": "#9cd3aa"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "fontFamily": {
                      "headline": ["Epilogue"],
                      "body": ["Manrope"],
                      "label": ["Manrope"]
              }
            },
          }
        }
      </script>
<style>
        body { font-family: 'Manrope', sans-serif; background-color: #f8faf8; }
        .font-headline { font-family: 'Epilogue', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .forest-gradient { background: linear-gradient(135deg, #002a13 0%, #0b4224 100%); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f2f4f2; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e1e3e1; border-radius: 10px; }
    </style>
</head>
<body class="text-on-surface">
<!-- TopNavBar -->
<header class="bg-[#f8faf8] dark:bg-[#002a13] sticky top-0 z-50">
<div class="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
<div class="flex items-center gap-8">
<div class="flex items-center gap-2">
<img alt="Zambezi Futures Logo" class="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/ADBb0uihflbDe9rRV4HuD3a_zQhaenLgkMNe3b0FPyxpytWNjDviG9tLuHOVlNs-ujJ55xsF0zO-wH3RzHhcmr0fzb4Ght6neLxEKqcJPabZRADMhjbaSQsjzURIYjzugchW47HcOZAjJ9j_QMl7RlEn2AZl71P7p8z6YqzRFQ31YCaimkpwKInR0cq0PdJ-kNtyJtOxTBZw7DNThf_02lngW1hbtEr36gAXnl556OOvlsnatRoyMqdWHknlRD1KBLwsW0rcPK1_CuDP2BU"/>
<div class="text-xl font-black italic text-primary dark:text-white font-headline tracking-tight leading-tight hidden sm:block">
    ZAMBEZI <br/>
<span class="text-secondary">FUTURES</span>
</div>
</div>
<nav class="hidden md:flex items-center gap-6 font-headline tracking-tight">
<a class="text-[#191c1b] dark:text-[#e1e3e1] font-medium hover:text-[#775a19] dark:hover:text-[#fed488] transition-colors duration-200" href="#">Home</a>
<a class="text-[#191c1b] dark:text-[#e1e3e1] font-medium hover:text-[#775a19] dark:hover:text-[#fed488] transition-colors duration-200" href="#">Register Player</a>
<a class="text-[#775a19] dark:text-[#fed488] font-bold border-b-2 border-[#775a19] pb-1" href="#">Database</a>
<a class="text-[#191c1b] dark:text-[#e1e3e1] font-medium hover:text-[#775a19] dark:hover:text-[#fed488] transition-colors duration-200" href="#">Archive</a>
<a class="text-[#191c1b] dark:text-[#e1e3e1] font-medium hover:text-[#775a19] dark:hover:text-[#fed488] transition-colors duration-200" href="#">Upcoming Tournaments</a>
<a class="text-[#191c1b] dark:text-[#e1e3e1] font-medium hover:text-[#775a19] dark:hover:text-[#fed488] transition-colors duration-200" href="#">Admin</a>
</nav>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-primary cursor-pointer text-2xl">account_circle</span>
</div>
</div>
<div class="bg-[#e1e3e1] dark:bg-[#0b4224] h-[1px] w-full"></div>
</header>
<main class="max-w-[1440px] mx-auto px-8 pt-12 pb-24">
<!-- Editorial Header Section -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
<div class="md:col-span-8">
<h1 class="text-6xl md:text-7xl font-black font-headline text-primary uppercase leading-[0.9] mb-6">
                    Academy Registry <br/>
<span class="text-secondary">Database</span>
</h1>
<p class="text-xl text-on-surface-variant font-medium max-w-2xl">
                    Browse all registered academies and training facilities within the Kinetic Archive ecosystem. Access elite performance data and infrastructure insights.
                </p>
</div>
<div class="md:col-span-4 flex flex-col justify-end items-end text-right">
<div class="bg-surface-container-highest p-6 rounded-lg w-full">
<span class="text-sm font-bold font-headline uppercase tracking-widest text-secondary block mb-1">Live Registry Count</span>
<span class="text-5xl font-black font-headline text-primary">124</span>
<span class="text-sm block text-on-surface-variant mt-2">Active Elite Institutions</span>
</div>
</div>
</div>
<!-- Filter Bar: Asymmetric Layout -->
<section class="bg-surface-container-low p-1 rounded-xl mb-12">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
<div class="lg:col-span-4">
<div class="relative">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
<input class="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-lg focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant" placeholder="Search academy name or ID..." type="text"/>
</div>
</div>
<div class="lg:col-span-2">
<select class="w-full px-4 py-4 bg-surface-container-lowest border-none rounded-lg focus:ring-0 text-on-surface font-medium appearance-none">
<option>Province/Region</option>
<option>Gauteng</option>
<option>Western Cape</option>
<option>KwaZulu-Natal</option>
</select>
</div>
<div class="lg:col-span-2">
<select class="w-full px-4 py-4 bg-surface-container-lowest border-none rounded-lg focus:ring-0 text-on-surface font-medium appearance-none">
<option>Age Category</option>
<option>U13 - U15</option>
<option>U16 - U18</option>
<option>Elite Development</option>
</select>
</div>
<div class="lg:col-span-2">
<select class="w-full px-4 py-4 bg-surface-container-lowest border-none rounded-lg focus:ring-0 text-on-surface font-medium appearance-none">
<option>Academy Status</option>
<option>Active</option>
<option>Inactive</option>
<option>Pending Audit</option>
</select>
</div>
<div class="lg:col-span-2 flex gap-2">
<button class="flex-1 forest-gradient text-white font-bold rounded-lg px-4 py-4 hover:opacity-90 transition-opacity">Apply</button>
<button class="p-4 bg-surface-container-high text-on-surface font-bold rounded-lg hover:bg-surface-container-highest transition-colors">
<span class="material-symbols-outlined align-middle">restart_alt</span>
</button>
</div>
</div>
</section>
<!-- View Controls & Counter -->
<div class="flex justify-between items-center mb-8">
<div class="flex items-center gap-4">
<span class="text-sm font-bold font-headline uppercase tracking-widest text-on-surface-variant">Found 124 Academies</span>
<div class="h-4 w-[1px] bg-outline-variant"></div>
<div class="flex bg-surface-container-high p-1 rounded-md">
<button class="px-3 py-1 bg-surface-container-lowest rounded shadow-sm">
<span class="material-symbols-outlined text-primary text-sm align-middle">grid_view</span>
</button>
<button class="px-3 py-1 text-on-surface-variant">
<span class="material-symbols-outlined text-sm align-middle">format_list_bulleted</span>
</button>
</div>
</div>
<div class="text-sm text-on-surface-variant">
                Sort by: <span class="text-primary font-bold cursor-pointer">Recently Added</span>
</div>
</div>
<!-- Academy Cards Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<!-- Card 1 -->
<div class="bg-surface-container-lowest rounded-xl overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
<div class="relative h-48 w-full bg-surface-container-high">
<img alt="Academy Logo" class="w-full h-full object-cover" data-alt="modern sports facility entrance with sleek glass architecture and professional football pitch in the background at sunrise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsdZNnGqsYLwebPNSKtxtQJiN0NkeptlLmtv96fttksPboKiEK6BrxrcCOA6NIc1qwoNgTW1NYZYJXPQHvTXmrjSbtywVjPtwnTA_X5zXX4hClZWADlhXWmbrpnvGCEtB5Y5KnhRJHuS5MhxrSM8m_W6BFtGIpahknWWL_ESHr-gQ7-3x78rFFpdxSeUN8C7oefk8BKfbDwZc4l17x2G2FozxkMFBTisijbGbbSvLwm5rDul6qU17rg5LF7IcetJz7DtO50GZC5yb6"/>
<div class="absolute top-4 right-4 bg-[#f8faf8]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/10">
<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
<span class="text-[10px] font-black uppercase tracking-tighter text-primary">Active Status</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-4">
<div>
<h3 class="text-xl font-bold font-headline text-primary leading-tight">Zambezi North Elite</h3>
<p class="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-sm">location_on</span> Lusaka, Zambia
                            </p>
</div>
<div class="h-10 w-10 flex items-center justify-center bg-surface-container-high rounded-lg font-black text-primary text-xs">
                            ZN
                        </div>
</div>
<div class="bg-surface-container-low rounded-lg p-4 mb-6 flex justify-between items-center">
<div>
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Registered Players</span>
<span class="text-2xl font-black font-headline text-primary">48</span>
</div>
<div class="text-right">
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Tier</span>
<span class="text-sm font-bold text-secondary">PRO-ELITE</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-all group-hover:bg-primary group-hover:text-white">
                        View Academy
                    </button>
</div>
</div>
<!-- Card 2 -->
<div class="bg-surface-container-lowest rounded-xl overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
<div class="relative h-48 w-full bg-surface-container-high">
<img alt="Academy Logo" class="w-full h-full object-cover" data-alt="close up of a professional soccer crest on a green team jersey with sunlight highlighting the fabric texture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY03rwUQ6UNDI3QRAxl-uwriofqC-Os0xs0XN6vPYaCIde0xsZ2vmV7KiCryDLIPyO0AzUByQ9TYJHZp0wnk9G7uT1FROgcXThOvix4g3kGbx5ru8hCA61nlrSV2EtAkypNux_r8DeOKI-CX64rtPAmq_fGXsPfp6zHmG48W430BLTDDUccg5PFOgEpd0PIQBhiLSBFbP_e4JzupRCjjoW_LEbXrjDJnV9T9FgYY7winWyzktBw02lUylj7aUlnCeT2S1VrUMmx8EB"/>
<div class="absolute top-4 right-4 bg-[#f8faf8]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/10">
<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
<span class="text-[10px] font-black uppercase tracking-tighter text-primary">Active Status</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-4">
<div>
<h3 class="text-xl font-bold font-headline text-primary leading-tight">Victoria Falls FC Academy</h3>
<p class="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-sm">location_on</span> Livingstone, Zambia
                            </p>
</div>
<div class="h-10 w-10 flex items-center justify-center bg-surface-container-high rounded-lg font-black text-primary text-xs">
                            VF
                        </div>
</div>
<div class="bg-surface-container-low rounded-lg p-4 mb-6 flex justify-between items-center">
<div>
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Registered Players</span>
<span class="text-2xl font-black font-headline text-primary">112</span>
</div>
<div class="text-right">
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Tier</span>
<span class="text-sm font-bold text-secondary">ACADEMY-1</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-all group-hover:bg-primary group-hover:text-white">
                        View Academy
                    </button>
</div>
</div>
<!-- Card 3 -->
<div class="bg-surface-container-lowest rounded-xl overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
<div class="relative h-48 w-full bg-surface-container-high">
<img alt="Academy Logo" class="w-full h-full object-cover" data-alt="aerial view of several high-performance turf football fields arranged symmetrically in a sports complex" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe5sbSN0bjG7oiSDTVYGmUQI1cz9grZSeIZvDvCfcChPxgBbth2mnOzIakNIvKk8ygK3o_E-QGfhKXlXx1-CZh5Xr4DrJNx4rjeRnQFIjOBsjcyg9vzAy5YooPXcf8eY721bsJLLgjH9laHDvDi4ofQu_6Iz-B-QrPWqOO9OWy_eg381sLNFnXQ34rbAtRgQSa7eZK1PVElxVnzsRokN1TD6LKubDvnTFizsgeNv7ct9lsotFXpjqykFuxqcZJwKVP6zBhJFrKegZZ"/>
<div class="absolute top-4 right-4 bg-[#f8faf8]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/10">
<span class="w-2 h-2 rounded-full bg-error"></span>
<span class="text-[10px] font-black uppercase tracking-tighter text-primary">Inactive</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-4">
<div>
<h3 class="text-xl font-bold font-headline text-primary leading-tight">Copperbelt High Flyers</h3>
<p class="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-sm">location_on</span> Ndola, Zambia
                            </p>
</div>
<div class="h-10 w-10 flex items-center justify-center bg-surface-container-high rounded-lg font-black text-primary text-xs">
                            CH
                        </div>
</div>
<div class="bg-surface-container-low rounded-lg p-4 mb-6 flex justify-between items-center">
<div>
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Registered Players</span>
<span class="text-2xl font-black font-headline text-primary">24</span>
</div>
<div class="text-right">
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Tier</span>
<span class="text-sm font-bold text-secondary">DEVELOPMENT</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-all group-hover:bg-primary group-hover:text-white">
                        View Academy
                    </button>
</div>
</div>
<!-- Card 4 -->
<div class="bg-surface-container-lowest rounded-xl overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
<div class="relative h-48 w-full bg-surface-container-high">
<img alt="Academy Logo" class="w-full h-full object-cover" data-alt="modern indoor athlete training facility with weight racks and professional sprinting track inside a high-end stadium" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzZZ_F6KT3zz-vivjcv4i1-n_gavKi7e7_TRs97fBnChk0wBnhKBKSVaVm-UrH6Q-MYQGrrv3bwMUKL8wNYsOSBY3bAl7Pw5ewV4mGHugf84ekk6VLJWjFDA76zuRAtwwPunPHO8t0jVf-McizkpKDCYXhrrytGbfJlgneVJ15E-iPMpEO6GtW350VvNEoaRt42Jzf_EVi1xq59oItjAKqvpDZ0bn1JQHIoX3mGrSnz0ZWTlywS637NmGRGr_vgVISsW2EP6Fc0PLX"/>
<div class="absolute top-4 right-4 bg-[#f8faf8]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/10">
<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
<span class="text-[10px] font-black uppercase tracking-tighter text-primary">Active Status</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-4">
<div>
<h3 class="text-xl font-bold font-headline text-primary leading-tight">Apex Performance Lab</h3>
<p class="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-sm">location_on</span> Sandton, South Africa
                            </p>
</div>
<div class="h-10 w-10 flex items-center justify-center bg-surface-container-high rounded-lg font-black text-primary text-xs">
                            AP
                        </div>
</div>
<div class="bg-surface-container-low rounded-lg p-4 mb-6 flex justify-between items-center">
<div>
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Registered Players</span>
<span class="text-2xl font-black font-headline text-primary">64</span>
</div>
<div class="text-right">
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Tier</span>
<span class="text-sm font-bold text-secondary">ELITE-DATA</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-all group-hover:bg-primary group-hover:text-white">
                        View Academy
                    </button>
</div>
</div>
<!-- Card 5 -->
<div class="bg-surface-container-lowest rounded-xl overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
<div class="relative h-48 w-full bg-surface-container-high">
<img alt="Academy Logo" class="w-full h-full object-cover" data-alt="dramatic lighting on a wall of trophies and awards in a premium dark green wood-paneled room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr4JWS7ij0MLGPEQO18pONo0lnOZXfttpEqaYZjCRZXosqCLOUGWyNvrqDAv-oY84iPm3KovO_34LWPJnNSJmnIaC3DLNA-qTsnC-y5hvtJwCB3BdYSrkX6zfLw83fmbh4BfhDhq8yhHLFVBPNyYH_f_SNGCwxghMUIvrhAl9NvDbTK61-U-EpG7B8lujVGRUVjcbYCOJdj5F49dAM7xQy8BTJ3cFc73rr3LqGaDQ571NNewnMXyerO7SfvqZf0JDqZQTRtUIhC_2h"/>
<div class="absolute top-4 right-4 bg-[#f8faf8]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/10">
<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
<span class="text-[10px] font-black uppercase tracking-tighter text-primary">Active Status</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-4">
<div>
<h3 class="text-xl font-bold font-headline text-primary leading-tight">Heritage Stars Academy</h3>
<p class="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-sm">location_on</span> Cape Town, South Africa
                            </p>
</div>
<div class="h-10 w-10 flex items-center justify-center bg-surface-container-high rounded-lg font-black text-primary text-xs">
                            HS
                        </div>
</div>
<div class="bg-surface-container-low rounded-lg p-4 mb-6 flex justify-between items-center">
<div>
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Registered Players</span>
<span class="text-2xl font-black font-headline text-primary">189</span>
</div>
<div class="text-right">
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Tier</span>
<span class="text-sm font-bold text-secondary">REGIONAL-HUB</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-all group-hover:bg-primary group-hover:text-white">
                        View Academy
                    </button>
</div>
</div>
<!-- Card 6 -->
<div class="bg-surface-container-lowest rounded-xl overflow-hidden group hover:translate-y-[-4px] transition-all duration-300">
<div class="relative h-48 w-full bg-surface-container-high">
<img alt="Academy Logo" class="w-full h-full object-cover" data-alt="close-up of professional football boots on lush green grass with stadium lights creating a soft bokeh in the background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAbRB_laRW-ml4NGD6ZBK3XdB3P0v4ddxdD8e9CXhQQnCi0LsGU_Od936FPjCIr7pQ0XbZzQM-ASVuxmH8_RpvRbUg5dLHy6Cl00B7n4PxmeOCLT_5YBRdFhMZXxMQyr9wVzl8FIocKVpKbVYCJMqiJF0OXfpwrpke6zsvmNec8zd1TGuGQru1loCQc405Xlk2pY0sUsjfPkckZfiAgNRxAVIzfGlUijvKWJRX2QDOPhffLZGY2vCxggKsJd_nQkmYVwQR-7kKno9u"/>
<div class="absolute top-4 right-4 bg-[#f8faf8]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/10">
<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
<span class="text-[10px] font-black uppercase tracking-tighter text-primary">Active Status</span>
</div>
</div>
<div class="p-6">
<div class="flex justify-between items-start mb-4">
<div>
<h3 class="text-xl font-bold font-headline text-primary leading-tight">Zambezi South Lions</h3>
<p class="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
<span class="material-symbols-outlined text-sm">location_on</span> Harare, Zimbabwe
                            </p>
</div>
<div class="h-10 w-10 flex items-center justify-center bg-surface-container-high rounded-lg font-black text-primary text-xs">
                            ZL
                        </div>
</div>
<div class="bg-surface-container-low rounded-lg p-4 mb-6 flex justify-between items-center">
<div>
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Registered Players</span>
<span class="text-2xl font-black font-headline text-primary">76</span>
</div>
<div class="text-right">
<span class="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Tier</span>
<span class="text-sm font-bold text-secondary">PRO-ELITE</span>
</div>
</div>
<button class="w-full py-3 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-all group-hover:bg-primary group-hover:text-white">
                        View Academy
                    </button>
</div>
</div>
</div>
<!-- Pagination Section -->
<div class="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
<p class="text-on-surface-variant font-medium">
                Showing <span class="text-primary font-bold">1 to 6</span> of 124 entries
            </p>
<div class="flex items-center gap-2">
<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant">
<span class="material-symbols-outlined">chevron_left</span>
</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg forest-gradient text-white font-bold">1</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors text-primary font-bold">2</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors text-primary font-bold">3</button>
<span class="px-2 text-outline">...</span>
<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors text-primary font-bold">21</button>
<button class="h-10 px-4 flex items-center justify-center gap-2 rounded-lg bg-surface-container-high text-primary font-bold hover:bg-secondary-container transition-colors">
                    Next Page <span class="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</main>
<!-- Professional Footer (Generated contextually) -->
<footer class="bg-primary py-16 text-white">
<div class="max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
<div class="col-span-1 md:col-span-2">
<img alt="Zambezi Futures Logo" class="h-12 w-auto mb-6 brightness-0 invert" data-alt="professional sports logo with abstract graphic and elegant bold typography for Zambezi Futures elite football academy archive" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0ZzdkWa2kTmNbSxOUJCIvHKl7pd49OvZ9TK2mynGqPjfiskUFdZfhQvlo0CBIi8gq4cG54cu-8MqxmyQk6f-_GlSZUJtzEPs7faULqeLQUK5eLsTiTASAxitRavpT_-bMyb1cygukaW2gm9Q47nn5k4sYY9JBAOg9ksy6fj0PJwCvMgBvaT9-tATzTst7yiyws9LueqvkyGVZzhit0k9TzdTapD3WvVrxMJlCWFj1ZLja7muOkJnWktM7ROboCKXro_ULfjX32rRW"/>
<p class="text-surface-variant max-w-sm font-light">
                    The Kinetic Archive is the definitive repository for elite African football development. Bridging traditional heritage with high-performance data analytics.
                </p>
</div>
<div>
<h4 class="font-headline font-bold uppercase tracking-widest text-secondary mb-6">Database Links</h4>
<ul class="space-y-3 text-surface-variant">
<li><a class="hover:text-white transition-colors" href="#">Global Registry</a></li>
<li><a class="hover:text-white transition-colors" href="#">Player Scout Portal</a></li>
<li><a class="hover:text-white transition-colors" href="#">Audit Status Check</a></li>
<li><a class="hover:text-white transition-colors" href="#">Academy Compliance</a></li>
</ul>
</div>
<div>
<h4 class="font-headline font-bold uppercase tracking-widest text-secondary mb-6">Support</h4>
<ul class="space-y-3 text-surface-variant">
<li><a class="hover:text-white transition-colors" href="#">Registration Guide</a></li>
<li><a class="hover:text-white transition-colors" href="#">Technical Support</a></li>
<li><a class="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
<li><a class="hover:text-white transition-colors" href="#">Archive Access</a></li>
</ul>
</div>
</div>
<div class="max-w-[1440px] mx-auto px-8 mt-16 pt-8 border-t border-primary-container flex flex-col md:flex-row justify-between items-center text-sm text-surface-variant opacity-60">
<p>© 2024 Zambezi Futures. All Rights Reserved.</p>
<div class="flex gap-6 mt-4 md:mt-0">
<a href="#">Terms of Use</a>
<a href="#">Elite Standards</a>
</div>
</div>
</footer>
</body></html>