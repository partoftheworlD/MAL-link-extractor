// ==UserScript==
// @name        MyAnimeList on amd.online
// @namespace   Violentmonkey Scripts
// @icon        https://amd.online/templates/Animedia1/images/favicon.svg
// @version     1.0.0
//
// @match       https://amd.online/*.html
// @grant       none
//
// @author      partoftheworlD
// @description
// ==/UserScript==
function showNotification(message, duration = 2000) {
	const old = document.getElementById('mal-copy-notification');
	if (old) old.remove();
	const popup = document.createElement('div');
	popup.id = 'mal-copy-notification';
	popup.textContent = message;
	Object.assign(popup.style, {
		position: 'fixed',
		bottom: '20px',
		left: '50%',
		transform: 'translateX(-50%)',
		backgroundColor: '#333',
		color: '#fff',
		padding: '12px 24px',
		borderRadius: '8px',
		fontFamily: 'Arial, sans-serif',
		fontSize: '16px',
		fontWeight: 'bold',
		boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
		zIndex: '100000',
		opacity: '0',
		transition: 'opacity 0.3s ease'
	});
	document.body.appendChild(popup);
	// Плавное появление
	requestAnimationFrame(() => {
		popup.style.opacity = '1';
	});
	// Автоисчезновение
	setTimeout(() => {
		popup.style.opacity = '0';
		setTimeout(() => popup.remove(), 300);
	}, duration);
}

function smartTrim(text, maxLength) {
	if (text.length <= maxLength) return text;
	const lastSpace = text.slice(0, maxLength).lastIndexOf(' ');
	const cutIndex = lastSpace > 0 ? lastSpace : maxLength;
	return text.slice(0, cutIndex)
}

function setButtonStyle(button, background_color, top, text) {
	button.innerHTML = `${text}`
	return Object.assign(button.style, {
		position: 'fixed',
		top: `${top}`,
		right: '10px',
		width: '160px',
		zIndex: '99999',
		// Размеры и отступы
		padding: '12px 24px',
		fontFamily: 'Arial, sans-serif',
		fontSize: '14px',
		fontWeight: 'bold',
		// Цвета и рамка
		backgroundColor: `${background_color}`,
		color: 'white',
		border: 'none',
		borderRadius: '8px',
		// Эффекты
		cursor: 'pointer',
		boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
		transition: 'all 0.3s ease',
	});
}

function getData() {
	const url = window.location.href;
	const localTitle = document.querySelector("#dle-content > article > div.amd-card > div.amd-content > div.amd-top > div:nth-child(1) > div.amd-title > h1")?.textContent || "";
	const ogTitle = document.querySelector("#dle-content > article > div.amd-card > div.amd-content > div.amd-top > div:nth-child(1) > div.amd-sub-container > span")?.textContent || "";
	const anime_name = smartTrim(ogTitle.trim(), 100);
	const malUrl = `https://myanimelist.net/anime.php?q=${encodeURIComponent(anime_name)}&cat=anime`;
	const match = localTitle.match(/«([^»]+)»/);
	const title = match ? match[1] : localTitle;
	const markdownLinks = `[${title}](${window.location.href})\n[${ogTitle}](${malUrl})`;
	return {
		markdownLinks,
		malUrl
	};
}
(function () {
	'use strict';
	let data = getData();
	const copyButton = document.createElement("button");
	let copyButtonColor = '#4CAF50';
	setButtonStyle(copyButton, `${copyButtonColor}`, '10px', 'Скопировать ссылки');
	copyButton.onmouseenter = () => copyButton.style.backgroundColor = '#459f48';
	copyButton.onmouseleave = () => copyButton.style.backgroundColor = `${copyButtonColor}`;
	copyButton.onclick = function () {
		navigator.clipboard.writeText(data.markdownLinks)
		showNotification("✨Скопировано в буфер обмена!");
	};
	document.body.appendChild(copyButton);
	const findButton = document.createElement("button");
	let findButtonColor = '#C50725';
	setButtonStyle(findButton, `${findButtonColor}`, '60px', 'Найти на MAL');
	findButton.onmouseenter = () => findButton.style.backgroundColor = '#B50725';
	findButton.onmouseleave = () => findButton.style.backgroundColor = `${findButtonColor}`;
	findButton.onclick = function () {
		window.open(data.malUrl, '_blank');
	};
	document.body.appendChild(findButton);
})();