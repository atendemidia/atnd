async function generateFlyer(index, button) {
    try {
        button.disabled = true;

        // Carrega a fonte
        const font = new FontFace('Heavitas', 'url(fonts/heavitas.ttf)');
        await font.load();
        document.fonts.add(font);

        // Obtém os valores dos inputs
        const date = document.querySelector('.date-' + index).value;
        const team1Path = document.querySelector('.team1_image-' + index).value;
        const team2Path = document.querySelector('.team2_image-' + index).value;

        // Captura os parâmetros da URL
        const params = new URLSearchParams(window.location.search);
        const bar = params.get('bar') || '';
        const local = params.get('local') || '';
        const png = params.get('png') || '';

        // Obtém o canvas e o contexto
        const canvas = document.querySelector('.flyerCanvas-' + index);
        const ctx = canvas.getContext('2d');

        // Carrega o background
        const background = new Image();
        background.src = params.has('bg')
            ? `BGs/bgs-futebol-ao-vivo/${params.get('bg')}.jpg`
            : 'BGs/bgs-futebol-ao-vivo/1.jpg';

        background.onload = function () {
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            const team1Img = new Image();
            team1Img.onload = function () {
                ctx.drawImage(team1Img, 125, 770, 320, 320);

                const team2Img = new Image();
                team2Img.onload = function () {
                    ctx.drawImage(team2Img, 635, 770, 320, 320);
                    drawTextAndElements();
                };
                team2Img.src = team2Path;
            };
            team1Img.src = team1Path;
        };

        function drawTextAndElements() {
            // Nome do bar
            ctx.fillStyle = '#FFCC00';
            ctx.font = '60px Heavitas';
            ctx.textAlign = 'center';
            ctx.fillText(bar, canvas.width / 2, 698);

            // Função para texto quebrado
            function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
                const words = text.split(' ');
                let line = '';
                const lines = [];

                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;

                    if (testWidth > maxWidth && i > 0) {
                        lines.push(line);
                        line = words[i] + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);

                for (let i = 0; i < lines.length; i++) {
                    ctx.fillText(lines[i], x, y + i * lineHeight);
                }
            }

            // Configurações do texto do endereço
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '35px Heavitas';
            ctx.textAlign = 'center';

            // Define largura máxima de 680px e altura da linha
            const maxWidth = 880;
            const lineHeight = 60;

            // Desenha o endereço (texto quebrado)
            drawWrappedText(ctx, local, canvas.width / 2, 1346, maxWidth, lineHeight);

            // Verifica a existência do PNG
            if (png) {
                const logoImg = new Image();
                logoImg.onload = function () {
                    ctx.drawImage(logoImg, (canvas.width - 250) / 2, 1464, 250, 250); // Centraliza o logo
                    finalizeFlyer();
                };
                logoImg.onerror = finalizeFlyer; // Continua mesmo se não encontrar o arquivo
                logoImg.src = `png/${png}`;
            } else {
                finalizeFlyer();
            }
        }

        function finalizeFlyer() {
            ctx.fillStyle = 'white';
			ctx.font = '45px Heavitas';
			ctx.textAlign = 'center';
			ctx.fillText(date.replace(/s+/g, ''), 510, 1210);

			var dataURL = canvas.toDataURL('image/jpeg', 0.9);
			var downloadLink = document.createElement('a');
			downloadLink.href = dataURL;
			downloadLink.download = 'flyer.jpg';
			document.body.appendChild(downloadLink);
			downloadLink.click();
			downloadLink.remove();
        }
    } catch (error) {
        console.error('Erro ao gerar flyer:', error);
        alert('Erro ao gerar flyer. Tente novamente.');
    } finally {
        button.disabled = false;
    }
}
