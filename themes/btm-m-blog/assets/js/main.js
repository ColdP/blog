(() => {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initMotion);
	} else {
		initMotion();
	}

	function initMotion() {
	const headerElement = document.querySelector('header');
	const revealTargets = [
		...document.querySelectorAll('main > *:not(script)'),
		...document.querySelectorAll('main section'),
	];

	const uniqueTargets = Array.from(new Set(revealTargets));

	uniqueTargets.forEach((element, index) => {
		element.classList.add('motion-reveal');
		const delayClass = `motion-reveal-delay-${Math.min((index % 3) + 1, 3)}`;
		element.classList.add(delayClass);
	});

	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver(
			(entries, currentObserver) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						currentObserver.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.08,
				rootMargin: '0px 0px -8% 0px',
			}
		);

		uniqueTargets.forEach((element) => observer.observe(element));
	} else {
		uniqueTargets.forEach((element) => element.classList.add('is-visible'));
	}

	const syncHeaderScrollState = () => {
		if (!headerElement) return;
		if (window.scrollY > 12) {
			headerElement.classList.add('header-scrolled');
		} else {
			headerElement.classList.remove('header-scrolled');
		}
	};

	syncHeaderScrollState();
	window.addEventListener('scroll', syncHeaderScrollState, { passive: true });

	initSearch();
	}

	function initSearch() {
		const searchInputs = Array.from(document.querySelectorAll('[data-search-input]'));
		if (!searchInputs.length) return;

		const searchableBlocks = Array.from(document.querySelectorAll('main section, main article'));
		const fallbackBlocks = searchableBlocks.length
			? searchableBlocks
			: Array.from(document.querySelectorAll('main > *:not(script):not(style)'));
		const menuItems = Array.from(document.querySelectorAll('.mobile-nav li'));

		const filterItems = (items, query) => {
			const keyword = query.trim().toLowerCase();
			items.forEach((item) => {
				const text = (item.textContent || '').toLowerCase();
				item.style.display = !keyword || text.includes(keyword) ? '' : 'none';
			});
		};

		const applySearch = (query) => {
			filterItems(fallbackBlocks, query);
			if (menuItems.length) {
				filterItems(menuItems, query);
			}
		};

		searchInputs.forEach((input) => {
			if (input.dataset.searchBound === 'true') return;
			input.dataset.searchBound = 'true';

			input.addEventListener('input', (event) => {
				const value = event.target.value;
				searchInputs.forEach((other) => {
					if (other !== event.target) {
						other.value = value;
					}
				});
				applySearch(value);
			});

			input.addEventListener('keydown', (event) => {
				if (event.key === 'Escape') {
					event.target.value = '';
					searchInputs.forEach((other) => {
						if (other !== event.target) {
							other.value = '';
						}
					});
					applySearch('');
				}
			});
		});
	}
})();
