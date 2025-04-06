document.addEventListener('DOMContentLoaded', function () {
  const storedData = localStorage.getItem('pastes');
  const mainDiv = document.querySelector('.lg\\:px-6');

  // Check if storedData is null or empty
  if (!storedData || storedData === '[]') {
    // Create "No Pastes Created Yet" message and "Create" button
    const card = document.createElement('div');
    card.setAttribute('data-aos', 'fade-up');
    card.classList.add(
      'text-center',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'text-[#cbcaca]',
      'mt-[20vh]',
      'aos-init',
      'aos-animate'
    );

    card.innerHTML = `
        <span class="text-6xl primarytext">No Pastes Created Yet!</span>
        <a href="/create" target="_blank" class="submit-button mt-8 w-[70%] lg:w-[20%]" id="button">
          <span><i class="cursor-pointer fa-light fa-plus mr-2"></i>Create</span>
        </a>
      `;
    mainDiv.appendChild(card); // Append the message to mainDiv

    // Ensure cards list is not visible
    const cardsList = document.createElement('div');
    cardsList.classList.add('cards-list', 'mt-8');
    mainDiv.appendChild(cardsList); // Append the cards list div
  } else {
    try {
      const data = JSON.parse(storedData);

      // Create and append the cards list div
      const cardsList = document.createElement('div');
      cardsList.classList.add('cards-list', 'mt-8');
      mainDiv.appendChild(cardsList);

      // Show the paste cards only if there is data
      data.forEach((item) => {
        const language =
          item.language.toLowerCase() === 'javascript' ? 'JS' : item.language.toUpperCase();
        const languageColors = {
          javascript: '#f1e05a',
          json: '#f1e05a',
          html: '#f06529',
          css: '#2965f1',
          markdown: '#ffffff',
          plaintext: '#ffffff'
        };
        const colorHex =
          languageColors[item.language.toLowerCase()] || '#ffffff';
        const colorRgb = hexToRgb(colorHex);

        function hexToRgb(hex) {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
              }
            : null;
        }

        function rgbToString(rgb) {
          return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }

        function humanizeTime(timestamp) {
          const now = new Date();
          const date = new Date(timestamp);
          const diff = Math.floor((now - date) / 1000);

          if (diff < 60) return `${diff}s ago`;
          if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
          if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
          if (now.getFullYear() === date.getFullYear()) {
            return date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short'
            });
          }
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }

        // Calculate the number of lines and characters
        const lines = item.code.split('\r\n').length;
        const chars = item.code.length;

        const card = document.createElement('a');
        card.href = `/${item.slug}`;
        card.target = '_blank';
        card.className = '[&>div]:w-full aos-init aos-animate';
        card.setAttribute('data-aos', 'fade-in');
        card.setAttribute('data-aos-duration', '1000');

        card.innerHTML = `
          <div class="paste-card rounded-lg bg-[#ffffff0a] text-white shadow" style="backdrop-filter: blur(4.5px); background-clip: padding-box;">
            <div class="card-top flex text-lg items-center justify-between">
              <div class="flex gap-3 text-lg items-center">
                <img src="/static/media/round-logo.png" alt="Img" class="card-img w-[32px] rounded-[7px]" />
                <div class="card-title">${item.title}</div>
              </div>
              <div class="cursor-pointer bg-[#ffffff0d] hover:bg-[#ffffff0a] hover:text-[#7760fe] hover:scale-105 rounded-[7px] py-[2px] px-[4px]">
                <i class="fa-light fa-link text-[#909090] text-lg"></i>
              </div>
            </div>
            <div class="card-main">
              <p class="desc mt-3 mb-1 text-[#cbcaca]">${item.description}</p>
            </div>
            <div class="card-footer flex justify-between items-center text-[#909090]">
              <div>${humanizeTime(
                item.time
              )} • ${lines} lines • ${chars} chars</div>
              <div class="language-pill w-max flex items-center py-2 px-4 rounded-[48px] bg-[#1a1a1a]">
                <svg style="fill: ${rgbToString(
                  colorRgb
                )}; color: ${rgbToString(
          colorRgb
        )};" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-1 h-3">
                  <path d="M0.877075 7.49991C0.877075 3.84222 3.84222 0.877075 7.49991 0.877075C11.1576 0.877075 14.1227 3.84222 14.1227 7.49991C14.1227 11.1576 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1576 0.877075 7.49991ZM7.49991 1.82708C4.36689 1.82708 1.82708 4.36689 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49991C13.1727 4.36689 10.6329 1.82708 7.49991 1.82708Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
                ${language}
              </div>
            </div>
          </div>
        `;

        cardsList.appendChild(card);
      });
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }
  }
});
