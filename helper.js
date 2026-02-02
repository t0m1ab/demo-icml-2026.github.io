const langFlags = {'fr': '🇫🇷', 'es': '🇪🇸', 'pt': '🇵🇹', 'de': '🇩🇪', 'it': '🇮🇹'};
const langNames = {'fr': 'French', 'es': 'Spanish', 'pt': 'Portuguese', 'de': 'German', 'it': 'Italian'};

const shortformFilenamesPerLang = {
  'fr': ["30ef344ae8687926.mp3", "4539f03d07ce7fbf.mp3"],  // "6d6261093edc78c2.mp3", "6d6261093edc78c2.mp3"],
  'es': ["5dc1d533e21f43b2.mp3", "963de6cbb0eaee36.mp3"],  // "a22a3eff8576211c.mp3", "ff65061e3b636834.mp3"],
  'pt': ["1263b98457966b2a.mp3", "3a2a8fd3a3bd2feb.mp3"],  // "6cf8e09e87612d2f.mp3", "70a4955ff0149f5f.mp3"],
  'de': ["2d05ea9d4a065778.mp3", "3f5d622c2955df4c.mp3"],  // "64fbd8fd8ecd4d63.mp3", "93cce2bd8093062f.mp3"],
  'it': ["61fada964460ad67.mp3", "9c6657d3fe647ecb.mp3", "84fbf6f8271c43b4.mp3", "83fcc138b2a8df7f.mp3"],  // "a1fa8e69d4019e03.mp3", "f30cef780a80ca78.mp3"],
};

const longformFilenamesPerLang = {
  'fr': ["ee67adf3f3768b1d_11labs.mp3", "f9fcfb48c566cfad_11labs.mp3"],
  'es': ["02fc8ce1843e4638_11labs.mp3", "bb3e91e3f0488a24_11labs.mp3"],
  'pt': ["73725fb3cf2cf669_cartesia.mp3 ", "7b42a118f93b1867_cartesia.mp3"],
  'de': ["02df47e0d27a8b80_cartesia.mp3", "b0e7b4b91e9d91db_gradium.mp3"],
};

function createAudioHTML(path) {
  return '<audio controls controlslist="nodownload" class="px-1"> <source src=' +
      path +
      ' type="audio/wav">Your browser does not support the audio element.</audio>';
}

function generateExampleRow(table_row, base_dir, lang, dirs, filename, row_idx, n_files_per_lang) {
  // Put the flag and full language name in the first column
  if (row_idx % n_files_per_lang === 0) {
    table_row.cells[0].innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 0.5em">
        <span style="font-size: 1em;">${langNames[lang] || lang}</span>
        <span style="font-size: 2em;">${langFlags[lang] || ''}</span>
      </div>
    `;
    table_row.cells[0].setAttribute('rowspan', n_files_per_lang);
    table_row.cells[0].style.verticalAlign = "middle";
    // Remove the first cell from the next row because of row span
    let nextRow = table_row.parentElement.rows[row_idx + 1];
    if (nextRow) {
      nextRow.deleteCell(0);
    }
  }

  // because of rowspan, odd row indexes have no source language cell
  let col_offset = (row_idx % n_files_per_lang === 0) ? 1 : 0;

  for (var col_idx = 0; col_idx < dirs.length; col_idx++) {

    let cell = table_row.cells[col_idx + col_offset];
    let p = base_dir + '/' + lang + '/' + dirs[col_idx] + '/' + filename;

    let container = cell.querySelector('div') || cell;

    if (p.endsWith('txt')) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
          container.innerHTML += '<font size="-1">' + req.responseText + '</font>';
        }
      };
      req.open('GET', p);
      req.send(null);
    } else {
      // container.innerHTML += createAudioHTML(p);
      container.innerHTML += `
        <div style="display: flex; justify-content: center; align-items: center;">
          ${createAudioHTML(p)}
        </div>
      `;
    }
  }
}

function generateSamplesTable(tableId, base_dir, fnames_per_lang, langs) {
  let tbody = document.getElementById(tableId).querySelector('tbody');
  let n_files_per_lang = fnames_per_lang[langs[0]].length;  // all langs must have the same number of samples
  let dirs = ['source', 'hibiki-zero', 'seamless'];
  for (var lang_idx = 0; lang_idx < langs.length; lang_idx++) {
    let lang = langs[lang_idx];
    let fnames = fnames_per_lang[lang];
    for (var sample_idx = 0; sample_idx < fnames.length; sample_idx++) {
      let row_idx = n_files_per_lang * lang_idx + sample_idx
      generateExampleRow(tbody.rows[row_idx], base_dir, lang, dirs, fnames[sample_idx], row_idx, n_files_per_lang);
    }
  }
}

generateSamplesTable('shortform-table', 'data/europarl-st', shortformFilenamesPerLang, ['fr', 'es', 'pt', 'de'])
generateSamplesTable('longform-table', 'data/audio_ntrex_4L', longformFilenamesPerLang, ['fr', 'es', 'pt', 'de'])
generateSamplesTable('shortform-table-it', 'data/europarl-st', shortformFilenamesPerLang, ['it'])

// Borrowed from https://nu-dialogue.github.io/j-moshi/
$(document).ready(function () {

    const columns = ['Hibiki-Zero', 'Seamless'];

    const rowLangIds = ['fr', 'es', 'pt', 'de'];

    const rows = [
        [
            'data-stereo/hibiki-zero_fr_3963c038b9f8d311_gradium.mp3',
            'data-stereo/seamless_fr_3963c038b9f8d311_gradium.mp3'
        ],
        [
            'data-stereo/hibiki-zero_es_949ebe18ff5f86ec_cartesia.mp3',
            'data-stereo/seamless_es_949ebe18ff5f86ec_cartesia.mp3'
        ],
        [
            'data-stereo/hibiki-zero_pt_4bb12dfdfd3877d8_11labs.mp3',
            'data-stereo/seamless_pt_4bb12dfdfd3877d8_11labs.mp3'
        ],
        [
            'data-stereo/hibiki-zero_de_3bf4c877f039e01a_11labs.mp3',
            'data-stereo/seamless_de_3bf4c877f039e01a_11labs.mp3'
        ],
    ];

    const table = $('#multistream-table');

    /* ---------- Header ---------- */
    const thead = $('<thead>');
    const headerRow = $('<tr>');

    headerRow.append($('<th>').text('Source language').css({'white-space': 'nowrap', 'text-align': 'center'}));


    columns.forEach(header => {
        headerRow.append($('<th style="text-align: center">').text(header));
    });

    thead.append(headerRow);
    table.append(thead);

    /* ---------- Body ---------- */
    const tbody = $('<tbody>');

    rows.forEach((files, i) => {
        const row = $('<tr>');

        // Language label cell with big flag
        const langName = langNames[rowLangIds[i]]
        const flag = langFlags[rowLangIds[i]] || '';
        row.append(
            $('<td>')
                .css({
                    'font-weight': 'bold',
                    'white-space': 'nowrap',
                    'vertical-align': 'middle'
                })
                .html(
                  `<div style="display: flex; align-items: center; justify-content: center; gap: 0.5em">
                    <span style="font-size: 1em;">${langName}</span>
                    <span style="font-size: 2em;">${flag}</span>
                  </div>`
                )
        );

        files.forEach((file, j) => {
            const waveCell = $('<td style="text-align: center; vertical-align: middle;">');
            const waveform = $('<div>').attr('id', `waveform-${i}-${j}`);
            waveCell.append(waveform);

            const playPauseButton = `
                <button class="btn btn-secondary mt-1" id="play-pause-${i}-${j}">
                    <i class="bi bi-play-fill"></i> Play /
                    <i class="bi bi-pause-fill"></i> Pause
                </button>
            `;
            waveCell.append(playPauseButton);
            row.append(waveCell);
        });

        tbody.append(row);
    });

    table.append(tbody);

    /* ---------- WaveSurfer ---------- */
    rows.forEach((files, i) => {
        files.forEach((file, j) => {
            const wavesurfer = WaveSurfer.create({
                container: `#waveform-${i}-${j}`,
                url: file,
                splitChannels: [
                    {
                        waveColor: '#39f2aeff',
                        progressColor: '#808080',
                    },
                    {
                        waveColor: '#ffab40ff',
                        progressColor: '#000000',
                    }
                ],
                barWidth: 2,
                height: 55,
                width: 650,
                normalize: true,
            });

            $(`#play-pause-${i}-${j}`).click(() => {
                wavesurfer.playPause();
            });
        });
    });

});
