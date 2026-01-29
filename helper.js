function createAudioHTML(path) {
  return '<audio controls controlslist="nodownload" class="px-1"> <source src=' +
      path +
      ' type="audio/wav">Your browser does not support the audio element.</audio>';
}

function generateExampleRow(table_row, base_dir, dirs, filename, col_offset) {
  for (var i = 0; i < dirs.length; i++) {
    let cell = table_row.cells[col_offset + i];
    let p = base_dir + '/' + dirs[i] + '/' + filename;
      if (p.endsWith('txt')) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
          if (this.readyState === this.DONE) {
            cell.innerHTML = '<font size="-1">' + req.responseText + '</font>';
          }
        };
        req.open('GET', p);
        req.send(null);
      } else {
        cell.innerHTML = cell.innerHTML + createAudioHTML(p);
      }
  }
}


function generateCVSS(tableId) {
  let table = document.getElementById(tableId);
  let base_dir = 'data/cvss_c_test'
  let dirs = ['source', 'hibiki', 'seamless'];
  let filenames = [
    "cvss-fr2en-test-idx14345-20007437.wav",
    "cvss-fr2en-test-idx14410-20011543.wav",
    "cvss-fr2en-test-idx14603-20030929.wav",
    "cvss-fr2en-test-idx14695-20041791.wav",
    "cvss-fr2en-test-idx4562-19004869.wav",
  ];

  for (var i = 0; i < filenames.length; i++) {
    generateExampleRow(table.rows[1 + i], base_dir, dirs, filenames[i], 0);
  }
}

function generateNTREX(tableId) {
  let table = document.getElementById(tableId);
  let base_dir = 'data/audio_ntrex_long'
  let dirs = ['source', 'hibiki', 'seamless'];
  let filenames = [
    "10887_ea80c8e6-883d-4afe-841b-598ce7db3779.wav",
    "3120_a63eabfc-d5aa-4353-84d0-9c5c068a1b38.wav",
    "5196_ea80c8e6-883d-4afe-841b-598ce7db3779.wav",
    "6855_f3c3ea82-42ef-4c09-b4aa-544a4c95518b.wav",
    "9605_83f1360e-7775-4d36-89f6-60649041c935.wav"
  ];

  for (var i = 0; i < filenames.length; i++) {
    generateExampleRow(table.rows[1 + i], base_dir, dirs, filenames[i], 0);
  }
}

function generateVoxPopuli(tableId) {
  let table = document.getElementById(tableId);
  let base_dir = 'data/voxpopuli'
  let dirs = ['source', 'hibiki_cfg=1', 'hibiki_cfg=3', 'hibiki_cfg=10', 'seamless'];
  let filenames = [
    "20090422-0900-PLENARY-3_20090422-09:53:50_7.wav",
    "20090506-0900-PLENARY-12_20090506-17:43:49_4.wav",
    "20090914-0900-PLENARY-15_20090914-20:43:54_7.wav",
    "20090916-0900-PLENARY-4_20090916-10:55:02_12.wav",
  ];

  for (var i = 0; i < filenames.length; i++) {
    generateExampleRow(table.rows[1 + i], base_dir, dirs, filenames[i], 0);
  }
}


generateNTREX('ntrex-table');
generateCVSS('cvss-table');
generateVoxPopuli('voxpopuli-table');

// Borrowed from https://nu-dialogue.github.io/j-moshi/
$(document).ready(function() {
    {
        const columns = ['Hibiki', 'Seamless'];
        const rows = [
            ['data-stereo/hibiki1.wav', 'data-stereo/seamless1.wav'],
            ['data-stereo/hibiki2.wav', 'data-stereo/seamless2.wav'],
            ['data-stereo/hibiki3.wav', 'data-stereo/seamless3.wav'],
        ];
        const table = $('#vis-table');

        // Add header
        const thead = $('<thead>');
        const headerRow = $('<tr>');
        columns.forEach(header => {
            headerRow.append($('<th style="text-align: center">').text(header));
        });
        thead.append(headerRow);
        table.append(thead);

        // Add rows
        const tbody = $('<tbody>');
        rows.forEach((files, i) => {
          const row = $('<tr>');
          files.forEach((files, j) => {
            // Add waveform cell
            const waveCell = $('<td style="text-align: center">');//.css('min-width', '200px');
            const waveform = $('<div>').attr('id', `waveform-${i}-${j}`);
            waveCell.append(waveform);
            const playPauseButton = `
                <button class="btn btn-secondary" data-action="play" id="play-pause-${i}-${j}">
                    <i class="bi bi-play-fill"></i> Play / <i class="bi bi-pause-fill"></i> Pause
                </button>
            `;
            waveCell.append(playPauseButton);
            row.append(waveCell);
          });
          tbody.append(row);
        });
        table.append(tbody);

        // Create wavesurfer instances
        rows.forEach((files, i) => {
          files.forEach((file, j) => {
            const wavesurfer = WaveSurfer.create({
                container: `#waveform-${i}-${j}`,
                url: file,
                splitChannels: [
                    {
                        waveColor: '#2E7D9E',
                        progressColor: '#173E4E',
                    },
                    {
                        waveColor: '#E57872',
                        progressColor: '#2A0908',
                    }
                ],
                barWidth: 2,
                height: 55,
                width: 700,
            });
            $(`#play-pause-${i}-${j}`).click(() => {
                wavesurfer.playPause();
            });
          });
        });
    }
    {
        const columns = ['Real Human Interpretation', 'Hibiki', 'Seamless'];
        const dirs = [
            "data/voxpopuli/gt_with_fr_background",
            "data/voxpopuli/hibiki_cfg=3_with_fr_background",
            "data/voxpopuli/seamless_with_fr_background",
        ];
        const rows = [
            "20090422-0900-PLENARY-3_20090422-09:53:50_7.wav",
            "20090506-0900-PLENARY-12_20090506-17:43:49_4.wav",
            "20090914-0900-PLENARY-15_20090914-20:43:54_7.wav",
            "20090916-0900-PLENARY-4_20090916-10:55:02_12.wav",
        ];
        const table = $('#vis-table2');

        // Add header
        const thead = $('<thead>');
        const headerRow = $('<tr>');
        columns.forEach(header => {
            headerRow.append($('<th style="text-align: center">').text(header));
        });
        thead.append(headerRow);
        table.append(thead);

        // Add rows
        const tbody = $('<tbody>');
        rows.forEach((file, i) => {
          const row = $('<tr>');
          dirs.forEach((d, j) => {
            // Add waveform cell
            const waveCell = $('<td style="text-align: center">');//.css('min-width', '200px');
            const waveform = $('<div>').attr('id', `waveform2-${i}-${j}`);
            waveCell.append(waveform);
            const playPauseButton = `
                <button class="btn btn-secondary" data-action="play" id="play-pause-${i}-${j}">
                    <i class="bi bi-play-fill"></i> Play / <i class="bi bi-pause-fill"></i> Pause
                </button>
            `;
            waveCell.append(playPauseButton);
            row.append(waveCell);
          });
          tbody.append(row);
        });
        table.append(tbody);

        // Create wavesurfer instances
        rows.forEach((file, i) => {
          dirs.forEach((dir, j) => {
            const wavesurfer = WaveSurfer.create({
                container: `#waveform2-${i}-${j}`,
                url: dir + '/' + file,
                barWidth: 2,
                height: 55,
            });
            $(`#play-pause-${i}-${j}`).click(() => {
                wavesurfer.playPause();
            });
          });
        });
    }
});
