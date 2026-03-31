import os

replacements = {
    'bg-[#0d0d14]': 'bg-[var(--a-bg)]',
    'bg-white/[0.03]': 'bg-[var(--a-panel)]',
    'bg-white/[0.04]': 'bg-[var(--a-input)]',
    'bg-white/[0.05]': 'bg-[var(--a-sub)]',
    'bg-white/[0.02]': 'bg-[var(--a-sub-hover)]',
    'bg-white/5': 'bg-[var(--a-hover-1)]',
    'bg-white/10': 'bg-[var(--a-hover-2)]',
    'bg-white/15': 'bg-[var(--a-hover-3)]',
    'bg-white/20': 'bg-[var(--a-hover-4)]',
    'bg-white/30': 'bg-[var(--a-hover-5)]',
    'border-white/[0.06]': 'border-[var(--a-border)]',
    'border-white/[0.08]': 'border-[var(--a-border-std)]',
    'border-white/10': 'border-[var(--a-border-hover)]',
    'border-white/20': 'border-[var(--a-border-focus)]',
    'bg-white': 'bg-[var(--a-text)]',
    'text-white': 'text-[var(--a-text)]',
    'text-white/90': 'text-[var(--a-text-90)]',
    'text-white/80': 'text-[var(--a-text-80)]',
    'text-white/70': 'text-[var(--a-text-70)]',
    'text-white/60': 'text-[var(--a-text-60)]',
    'text-white/50': 'text-[var(--a-text-50)]',
    'text-white/40': 'text-[var(--a-text-40)]',
    'text-white/30': 'text-[var(--a-text-30)]',
    'text-white/25': 'text-[var(--a-text-25)]',
    'text-white/20': 'text-[var(--a-text-20)]',
    'text-white/10': 'text-[var(--a-text-10)]',
    'text-white/5': 'text-[var(--a-text-5)]',
    'placeholder-white/20': 'placeholder-[var(--a-text-20)]',
    'border-white': 'border-[var(--a-text)]',
}

files = [
    'frontend/src/pages/Admin/AdminDashboard.jsx',
    'frontend/src/components/Admin/ProductAdmin.jsx',
    'frontend/src/components/Admin/CategoryAdmin.jsx',
    'frontend/src/components/Admin/GalleryAdmin.jsx',
    'frontend/src/components/Admin/AdminStats.jsx',
    'frontend/src/components/Admin/ImageDropZone.jsx',
    'frontend/src/components/Admin/AdminToast.jsx'
]

for fpath in files:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        for old, new in replacements.items():
            content = content.replace(old, new)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {fpath}")
    else:
        print(f"File not found: {fpath}")
