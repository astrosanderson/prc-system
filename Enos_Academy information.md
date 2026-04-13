<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Zambezi Elite Academy | Athlete Roster</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;900&amp;family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "background": "#f8f9fa",
                        "on-tertiary-fixed-variant": "#075139",
                        "tertiary-container": "#24654b",
                        "tertiary-fixed": "#aef1cf",
                        "error-container": "#ffdad6",
                        "on-error-container": "#93000a",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-container": "#8fe2ba",
                        "primary": "#004d34",
                        "on-secondary-fixed-variant": "#5f4100",
                        "surface": "#f8f9fa",
                        "error": "#ba1a1a",
                        "secondary-fixed-dim": "#ffba2c",
                        "surface-bright": "#f8f9fa",
                        "inverse-surface": "#2e3132",
                        "inverse-on-surface": "#f0f1f2",
                        "tertiary": "#004d35",
                        "on-surface": "#191c1d",
                        "primary-fixed-dim": "#84d7af",
                        "secondary": "#7d5700",
                        "on-secondary-fixed": "#271900",
                        "surface-container-low": "#f3f4f5",
                        "surface-container-high": "#e7e8e9",
                        "outline": "#6f7a72",
                        "on-surface-variant": "#3f4943",
                        "surface-container": "#edeeef",
                        "on-tertiary": "#ffffff",
                        "secondary-fixed": "#ffdeaa",
                        "secondary-container": "#feb71a",
                        "on-tertiary-container": "#9ee0bf",
                        "tertiary-fixed-dim": "#93d4b4",
                        "on-primary": "#ffffff",
                        "on-primary-fixed": "#002114",
                        "on-secondary-container": "#6b4b00",
                        "on-secondary": "#ffffff",
                        "surface-variant": "#e1e3e4",
                        "inverse-primary": "#84d7af",
                        "surface-container-highest": "#e1e3e4",
                        "on-error": "#ffffff",
                        "on-background": "#191c1d",
                        "on-primary-fixed-variant": "#005137",
                        "outline-variant": "#bec9c1",
                        "surface-dim": "#d9dadb",
                        "primary-container": "#006747",
                        "surface-tint": "#0b6c4b",
                        "on-tertiary-fixed": "#002114",
                        "primary-fixed": "#a0f4ca"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "1rem",
                        "xl": "1.5rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Space Grotesk"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, .font-headline { font-family: 'Space Grotesk', sans-serif; }
    </style>
</head>
<body class="bg-surface text-on-surface">
<!-- Top Navigation -->
<header class="bg-white/80 dark:bg-emerald-950/80 backdrop-blur-xl shadow-sm shadow-emerald-900/5 sticky top-0 z-50">
<nav class="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
<div class="text-2xl font-black text-emerald-900 dark:text-emerald-50 italic">Elite Academy</div>
<div class="hidden md:flex gap-8">
<a class="text-emerald-800/60 font-['Space_Grotesk'] tracking-tight font-bold uppercase text-sm hover:text-emerald-900 transition-colors duration-300" href="#">Dashboard</a>
<a class="text-emerald-900 border-b-2 border-amber-400 pb-1 font-['Space_Grotesk'] tracking-tight font-bold uppercase text-sm" href="#">Athletes</a>
<a class="text-emerald-800/60 font-['Space_Grotesk'] tracking-tight font-bold uppercase text-sm hover:text-emerald-900 transition-colors duration-300" href="#">Training</a>
<a class="text-emerald-800/60 font-['Space_Grotesk'] tracking-tight font-bold uppercase text-sm hover:text-emerald-900 transition-colors duration-300" href="#">Schedules</a>
<a class="text-emerald-800/60 font-['Space_Grotesk'] tracking-tight font-bold uppercase text-sm hover:text-emerald-900 transition-colors duration-300" href="#">Analytics</a>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-primary cursor-pointer transition-transform active:opacity-80 scale-95" data-icon="notifications">notifications</span>
<span class="material-symbols-outlined text-primary cursor-pointer transition-transform active:opacity-80 scale-95" data-icon="settings">settings</span>
<div class="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary-container">
<img alt="User profile avatar" data-alt="Close-up portrait of a professional sports academy coach with a confident expression and blurred stadium background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUWY33Z-gVeJW0NcjV4wAZlT-CRD9Z_bmLPdGmtlldBkz458LR58E8rEWGpcS8ZG0br-ocE_avJLBXr25ysWg6Ez00k7WNdEk-fsdfw0KeZRj3w3K_XTAohmcW9fq4AFCvstWXWLTjYP8fmfQwyD_kezV5mvLRGZCSiz6-DPFdCTGCiZkfD-uOkcykH10dO7PWiTOCT1NsToS5_JKHt1Zr5roQclBpafRyBE2qanJRgNtLOyPbY7AZb53Ntrk1IMzJR6P5GF1iVVk"/>
</div>
</div>
</nav>
</header>
<main class="max-w-screen-2xl mx-auto px-8 py-12">
<!-- Hero Section -->
<div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
<div>
<label class="text-secondary font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Athlete Registry</label>
<h1 class="text-5xl md:text-7xl font-black text-primary italic -tracking-[0.03em] leading-none mb-4">ZAMBIZI ELITE ACADEMY</h1>
<p class="text-on-surface-variant max-w-xl text-lg font-light leading-relaxed">Comprehensive registry of academy talent across all regional divisions. Advanced analytics and performance tracking active.</p>
</div>
<div class="flex gap-4">
<button class="px-8 py-3 bg-surface-container-highest text-primary font-bold rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-all">
<span class="material-symbols-outlined" data-icon="filter_list">filter_list</span>
                    Filter
                </button>
<button class="px-8 py-3 bg-primary-container text-on-primary font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
                    + Add Player
                </button>
</div>
</div>
<!-- Metrics Bento Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-primary relative overflow-hidden group">
<div class="relative z-10">
<p class="text-xs font-bold text-secondary uppercase tracking-widest mb-1">TOTAL PLAYERS</p>
<h3 class="text-5xl font-black text-primary italic">142</h3>
<div class="flex items-center gap-1 text-emerald-600 mt-2 font-bold">
<span class="material-symbols-outlined text-sm" data-icon="arrow_upward">arrow_upward</span>
                        +12% <span class="text-xs font-normal text-on-surface-variant ml-1">since last season</span>
</div>
</div>
<span class="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" data-icon="groups">groups</span>
</div>
<div class="bg-primary p-8 rounded-xl shadow-lg relative overflow-hidden group">
<div class="relative z-10">
<p class="text-xs font-bold text-secondary-container uppercase tracking-widest mb-1">U-17 DIVISION</p>
<h3 class="text-5xl font-black text-white italic">38</h3>
<div class="text-primary-fixed-dim mt-2 font-medium opacity-80">Primary Talent Hub</div>
</div>
<div class="absolute inset-0 bg-gradient-to-br from-primary-container to-primary opacity-50"></div>
<span class="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" data-icon="star">star</span>
</div>
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-secondary-container relative overflow-hidden group">
<div class="relative z-10">
<p class="text-xs font-bold text-secondary uppercase tracking-widest mb-1">AVERAGE AGE</p>
<h3 class="text-5xl font-black text-primary italic">15.4</h3>
<div class="text-on-surface-variant mt-2 font-medium">Academy Std. Optimal</div>
</div>
<span class="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-secondary-container/10 rotate-6 group-hover:rotate-0 transition-transform duration-700" data-icon="calendar_today">calendar_today</span>
</div>
</div>
<!-- Controls & Search -->
<div class="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
<div class="flex bg-surface-container p-1 rounded-full w-full md:w-auto">
<button class="px-6 py-2 rounded-full text-sm font-bold bg-primary text-white transition-all">All Divisions</button>
<button class="px-6 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-primary transition-all">U-15</button>
<button class="px-6 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-primary transition-all">U-17</button>
<button class="px-6 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-primary transition-all">U-20</button>
</div>
<div class="relative w-full md:w-96 group">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" data-icon="search">search</span>
<input class="w-full pl-12 pr-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-0 focus:border-b-2 focus:border-primary transition-all placeholder:text-outline font-medium" placeholder="Search by name, ID or division..." type="text"/>
</div>
</div>
<!-- Roster Table -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-12">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low border-none">
<th class="px-6 py-4 text-xs font-bold text-primary uppercase tracking-widest">Player Portrait</th>
<th class="px-6 py-4 text-xs font-bold text-primary uppercase tracking-widest">Full Name</th>
<th class="px-6 py-4 text-xs font-bold text-primary uppercase tracking-widest">Age</th>
<th class="px-6 py-4 text-xs font-bold text-primary uppercase tracking-widest">Division</th>
<th class="px-6 py-4 text-xs font-bold text-primary uppercase tracking-widest">PRC ID</th>
<th class="px-6 py-4 text-xs font-bold text-primary uppercase tracking-widest text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container">
<!-- Player 1 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-5">
<img class="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Headshot of a young male athlete with a focused look against a neutral athletic background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7cYZwrMsasjbebsPBQIns0eUoP2WsxToHubdXKYqJ6rYzS24NZkRA4WGbLddRWTVlgH6keHvW_e7LG9b7UWjTjl-LXYw3X8NFgUkwdfFiLzr1lSmXaKbOl-6Qer6i9jlpOG04jyTPyxjRfSoAkfL1o28VI_omF5y1tI1WCU011xQiNHVgvS5Ismg0CENWSMsO9lRTmfY9TLxIpunADOpfjVGTTQvoX9dZqY_XuIoCWUEAIGrJl3YbOgIvQB8RHkBreI_8rQuWc9o"/>
</td>
<td class="px-6 py-5">
<div class="font-bold text-primary text-lg">Tendai Mokoena</div>
<div class="text-xs text-on-surface-variant font-medium">Forward</div>
</td>
<td class="px-6 py-5 text-on-surface font-medium">16</td>
<td class="px-6 py-5">
<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">U-17</span>
</td>
<td class="px-6 py-5 font-mono text-sm text-outline">PRC-9921-X</td>
<td class="px-6 py-5 text-right">
<button class="text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="visibility">visibility</span></button>
<button class="ml-4 text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="edit">edit</span></button>
</td>
</tr>
<!-- Player 2 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-5">
<img class="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Portrait of a young female athlete with braided hair looking determined at the camera" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnyqFRlciQ2JinHqw7fftSThmU2CrGcL7qKi88RkWlzVZmVNSCVm6AZHf2BtW5dfezOJSqlAe0W6GGJ-aeJMALzQZXscpYJcrzEEjXzuhGcfd7zybQj1B36YUXGdJ2NiqWDb4D6sjZEzHMWHefJGJVlwdP8Bf_sfl_IQQyVhIa2qvNr7hztzu9qegavuh88w_zVFdX7HrprucWidzdUoziD8_ho3oLFE5qqRxHZqfV8Pco821UZ2vysRRyvXpIb5e_FT4Dne1yEpw"/>
</td>
<td class="px-6 py-5">
<div class="font-bold text-primary text-lg">Khensani Dlamini</div>
<div class="text-xs text-on-surface-variant font-medium">Midfielder</div>
</td>
<td class="px-6 py-5 text-on-surface font-medium">14</td>
<td class="px-6 py-5">
<span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">U-15</span>
</td>
<td class="px-6 py-5 font-mono text-sm text-outline">PRC-4452-A</td>
<td class="px-6 py-5 text-right">
<button class="text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="visibility">visibility</span></button>
<button class="ml-4 text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="edit">edit</span></button>
</td>
</tr>
<!-- Player 3 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-5">
<img class="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Profile of a teenage male athlete with sharp features and athletic build" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtcuumVIISqQYUsUnishMVUOarJVTZNQQLZoAuc69Kla0UvHkM-KAS7RiepZ06_KcpBMjM6Rl7pf17pLzA-O-9Dcpw0CgZDzZolvkhMRBmwOQfqlrVNLI13oj0q1sk6UojdlhCQpGrtl0QdIGnUnE8rA2QJfmAZuLIbKkUUVZ8QmGBHJfJ0eADUfdx2OFwCQuSLpizcu8D0LX4O2H1yQqT8CoF7RVfW-1K156kUz-iXkcUfDnoCOsC-mkvBweR-jtn-K8es8BgJaw"/>
</td>
<td class="px-6 py-5">
<div class="font-bold text-primary text-lg">Luan Richards</div>
<div class="text-xs text-on-surface-variant font-medium">Goalkeeper</div>
</td>
<td class="px-6 py-5 text-on-surface font-medium">19</td>
<td class="px-6 py-5">
<span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">U-20</span>
</td>
<td class="px-6 py-5 font-mono text-sm text-outline">PRC-1088-K</td>
<td class="px-6 py-5 text-right">
<button class="text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="visibility">visibility</span></button>
<button class="ml-4 text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="edit">edit</span></button>
</td>
</tr>
<!-- Player 4 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-5">
<img class="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Young woman with intense focus, wearing sports attire in a bright outdoor environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2GvVTSt6A3HBl3SMQPQjNECZ2L1HEk93E_faunwtBAox0sGf9q-rXPNVJndK4wRBmuBYQfhlSLsbERxHQpEDIuec6-s4k2sg1eZprrs2nwvibCPGFTPaDHaGU_7xTaORp9n-rslrWh9Y8pY91E6ZgUxyrRTVNg0kHAA4jB9FZrAxDOeA4UgWIgi_hdE764Oh6riBFuhGDJ7xLALkcgoZTOpMmgEbtqm6GJWEPl4-I_03jsbjEY3EuQNN0aBXGZizf3KBaAU9RYRk"/>
</td>
<td class="px-6 py-5">
<div class="font-bold text-primary text-lg">Amara Okafor</div>
<div class="text-xs text-on-surface-variant font-medium">Defender</div>
</td>
<td class="px-6 py-5 text-on-surface font-medium">16</td>
<td class="px-6 py-5">
<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">U-17</span>
</td>
<td class="px-6 py-5 font-mono text-sm text-outline">PRC-8812-M</td>
<td class="px-6 py-5 text-right">
<button class="text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="visibility">visibility</span></button>
<button class="ml-4 text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="edit">edit</span></button>
</td>
</tr>
<!-- Player 5 -->
<tr class="hover:bg-surface-container-low transition-colors group">
<td class="px-6 py-5">
<img class="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="Portrait of a young male soccer player with short hair and serious athletic concentration" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDslDlHO227jkPNF2BWSyoZUG5B4bHBlHQUVyFbiBJDGWqOPLvzz1Db8aqqB3sBqnwa5K5UDBLNLysYxB3kdA447w0RlJBquPUgRXKKjoIErAyJCE3_04IvJn3ws2h13StA2wE8zDFGjZZnhAkuJhaGkLHwIXQ_jEJnSn4lznmiT_JwLbr_yIfb5lEfSDyM7-zv9c7xr6a-NWGTjx_rihFdCthZ2b3cJXfzd90sjIUshBM5ZojptHlBGpsV16Cs6mN5JfkXhfEoErA"/>
</td>
<td class="px-6 py-5">
<div class="font-bold text-primary text-lg">Sipho Zulu</div>
<div class="text-xs text-on-surface-variant font-medium">Midfielder</div>
</td>
<td class="px-6 py-5 text-on-surface font-medium">15</td>
<td class="px-6 py-5">
<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">U-17</span>
</td>
<td class="px-6 py-5 font-mono text-sm text-outline">PRC-2239-P</td>
<td class="px-6 py-5 text-right">
<button class="text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="visibility">visibility</span></button>
<button class="ml-4 text-primary hover:text-secondary-container transition-colors"><span class="material-symbols-outlined" data-icon="edit">edit</span></button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Pagination -->
<div class="flex flex-col md:flex-row items-center justify-between gap-4">
<p class="text-on-surface-variant text-sm font-medium">Showing <span class="text-primary font-bold">1-5</span> of 142 athletes</p>
<div class="flex items-center gap-2">
<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container text-outline hover:text-primary transition-all">
<span class="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg text-primary font-bold hover:bg-surface-container transition-all">2</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg text-primary font-bold hover:bg-surface-container transition-all">3</button>
<span class="text-outline mx-1">...</span>
<button class="w-10 h-10 flex items-center justify-center rounded-lg text-primary font-bold hover:bg-surface-container transition-all">29</button>
<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container text-outline hover:text-primary transition-all">
<span class="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</main>
<!-- Footer -->
<footer class="bg-emerald-950 dark:bg-black mt-24">
<div class="flex flex-col md:flex-row justify-between items-center px-12 py-10 w-full max-w-screen-2xl mx-auto">
<div class="font-['Space_Grotesk'] font-bold text-emerald-50 text-xl mb-6 md:mb-0">Kinematic Gallery Elite</div>
<div class="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
<a class="font-['Inter'] text-xs tracking-wider font-medium text-emerald-300/70 hover:text-amber-400 underline decoration-amber-400/50 underline-offset-4 opacity-80 transition-opacity" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs tracking-wider font-medium text-emerald-300/70 hover:text-amber-400 underline decoration-amber-400/50 underline-offset-4 opacity-80 transition-opacity" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs tracking-wider font-medium text-emerald-300/70 hover:text-amber-400 underline decoration-amber-400/50 underline-offset-4 opacity-80 transition-opacity" href="#">Support</a>
<a class="font-['Inter'] text-xs tracking-wider font-medium text-emerald-300/70 hover:text-amber-400 underline decoration-amber-400/50 underline-offset-4 opacity-80 transition-opacity" href="#">Contact</a>
</div>
<div class="font-['Inter'] text-xs tracking-wider font-medium text-emerald-50 opacity-60">
                © 2024 Kinematic Gallery Elite Sports Academy. All rights reserved.
            </div>
</div>
</footer>
</body></html>