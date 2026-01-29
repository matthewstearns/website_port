/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

	// Resources Page Filtering System
		$(document).ready(function() {
			// Filter functionality for resources page
			function initResourceFilters() {
				const filterPills = document.querySelectorAll('#resource-filters .pill');
				const searchInput = document.getElementById('resource-search');
				const resourceCards = document.querySelectorAll('.resource-card, .card');
				
				if (!filterPills.length || !resourceCards.length) return;
				
				// Filter by category
				filterPills.forEach(pill => {
					pill.addEventListener('click', function() {
						// Update active pill
						filterPills.forEach(p => p.classList.remove('active'));
						this.classList.add('active');
						
						const filterValue = this.getAttribute('data-filter');
						filterResources(filterValue, searchInput ? searchInput.value : '');
					});
				});
				
				// Search functionality
				if (searchInput) {
					searchInput.addEventListener('input', function() {
						const activeFilter = document.querySelector('#resource-filters .pill.active');
						const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
						filterResources(filterValue, this.value);
					});
				}
				
				function filterResources(category, searchTerm) {
					const lowerSearchTerm = searchTerm.toLowerCase();
					
					resourceCards.forEach(card => {
						const cardTags = card.getAttribute('data-tags') || '';
						const cardTitle = card.querySelector('h4, .title');
						const cardDescription = card.querySelector('.description, .desc');
						
						const titleText = cardTitle ? cardTitle.textContent.toLowerCase() : '';
						const descText = cardDescription ? cardDescription.textContent.toLowerCase() : '';
						
						// Check category filter
						let categoryMatch = category === 'all' || cardTags.includes(category);
						
						// Check search term
						let searchMatch = !searchTerm || 
							titleText.includes(lowerSearchTerm) || 
							descText.includes(lowerSearchTerm) ||
							cardTags.toLowerCase().includes(lowerSearchTerm);
						
						// Show/hide card with animation
						if (categoryMatch && searchMatch) {
							card.style.display = '';
							card.style.opacity = '0';
							card.style.transform = 'translateY(20px)';
							
							setTimeout(() => {
								card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
								card.style.opacity = '1';
								card.style.transform = 'translateY(0)';
							}, 50);
						} else {
							card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
							card.style.opacity = '0';
							card.style.transform = 'translateY(-20px)';
							
							setTimeout(() => {
								card.style.display = 'none';
							}, 300);
						}
					});
					
					// Update results count
					setTimeout(() => {
						const visibleCards = Array.from(resourceCards).filter(card => 
							card.style.display !== 'none'
						);
						
						// Optional: Show "no results" message
						const noResultsMsg = document.getElementById('no-results-message');
						if (visibleCards.length === 0 && !noResultsMsg) {
							const message = document.createElement('div');
							message.id = 'no-results-message';
							message.className = 'no-results';
							message.innerHTML = `
								<div style="text-align: center; padding: 2rem; opacity: 0.7;">
									<i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
									<h3>No resources found</h3>
									<p>Try adjusting your search terms or filters.</p>
								</div>
							`;
							
							const resourcesGrid = document.getElementById('resources-grid');
							if (resourcesGrid) {
								resourcesGrid.appendChild(message);
							}
						} else if (visibleCards.length > 0 && noResultsMsg) {
							noResultsMsg.remove();
						}
					}, 400);
				}
			}
			
			// Initialize filters when resources page is shown
			function checkResourcesPage() {
				const resourcesArticle = document.getElementById('resources');
				if (resourcesArticle && resourcesArticle.classList.contains('active')) {
					setTimeout(initResourceFilters, 100);
				}
			}
			
			// Monitor for when resources page becomes active
			const observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
						checkResourcesPage();
					}
				});
			});
			
			// Observe all articles for class changes
			document.querySelectorAll('article').forEach(article => {
				observer.observe(article, { attributes: true });
			});
			
			// Also check on page load
			setTimeout(checkResourcesPage, 500);
		});

	// Profile Image Carousel (similar to quote carousel)
		$(document).ready(function() {
			let currentImage = 0;
			const images = $('.profile-photo-large');
			const imageDots = $('.image-dots .dot');
			const totalImages = images.length;

			// Auto-cycle through images every 45 seconds
			function nextImage() {
				images.eq(currentImage).removeClass('active');
				imageDots.eq(currentImage).removeClass('active');
				
				currentImage = (currentImage + 1) % totalImages;
				
				images.eq(currentImage).addClass('active');
				imageDots.eq(currentImage).addClass('active');
			}

			// Manual image control via dots
			imageDots.on('click', function() {
				const targetImage = parseInt($(this).data('image'));
				
				images.eq(currentImage).removeClass('active');
				imageDots.eq(currentImage).removeClass('active');
				
				currentImage = targetImage;
				
				images.eq(currentImage).addClass('active');
				imageDots.eq(currentImage).addClass('active');
			});

			// Start auto-cycling every 45 seconds
			setInterval(nextImage, 45000);
		});

})(jQuery);