/* Lasers & Treason Mission Control — dependency-free by design for GitHub Pages. */

const STORAGE_KEY = 'lasers-treason-mission-control-v1';
const missionPhases = ['Mission alert', 'Briefing', 'PLC outfitting', 'R&D outfitting', 'The mission', 'Debriefing'];
const clearanceCodes = { ULTRAVIOLET: 'U', VIOLET: 'V', INDIGO: 'N', BLUE: 'B', GREEN: 'G', YELLOW: 'Y', ORANGE: 'O', RED: 'R', INFRARED: 'I' };
const creationSteps = [
  { kicker: '01 // CLEARANCE', title: 'Know your color.', description: 'Your clearance determines which equipment and sectors you may legally use. The current mission is tuned for RED clearance, citizen.', next: 'Choose service' },
  { kicker: '02 // SERVICE GROUP', title: 'Remember your useful former life.', description: 'Your service background may add +1d6 to a risky action when it honestly helps. No two Troubleshooters pick the same group.', next: 'Declare restrictions' },
  { kicker: '03 // RESTRICTED FACTORS', title: 'Submit to random screening.', description: 'Roll once on each restricted table. Secret societies and mutant powers are assigned by the dice; loyal citizens do not shop around.', next: 'Set your number' },
  { kicker: '04 // LASERS / TREASON', title: 'Calibrate your instincts.', description: 'Choose a number from 2 to 5. Low means you are better at Lasers; high means you are better at Treason.', next: 'Register your clone' },
  { kicker: '05 // DESIGNATION', title: 'Give your clone a name.', description: 'Use the approved format: Name–Clearance Letter–Home Subsector–Clone Number. Friend Computer has generously issued six clones.', next: 'Accept equipment' },
  { kicker: '06 // STANDARD ISSUE', title: 'Accept your property.', description: 'Friend Computer has issued this useful equipment for mission success. It would be ungrateful to misplace any of it.', next: 'Receive orders' },
  { kicker: '07 // STANDING ORDERS', title: 'Become useful.', description: 'Add an optional personal imperative. Succeed in the mission, find trouble, and report treason. Friend Computer believes in you.', next: 'Complete record' }
];

const secretSocietyTable = [
  [
    { name: 'Anti-Mutant', description: 'Hunt mutants on sight, registered or otherwise. The only good mutant is a terminated mutant.' },
    { name: 'Free Enterprise', description: 'Find new revenue, sell new products, and do absolutely anything for the bottom line.' }
  ],
  [
    { name: 'Communists', description: 'End the Computer’s reign and bring fairness and equality to clones of every clearance.' },
    { name: 'Illuminati', description: 'Your directives are comprehensively redacted. Manipulate events until the appointed time.' }
  ],
  [
    { name: 'Corpore Metal', description: 'Bots are superior. Become more machine-like and show proper respect to your bot superiors.' },
    { name: 'Mystics', description: 'Open every mind to wonderful new experiences, happiness, and enlightenment. With drugs.' }
  ],
  [
    { name: 'Death Leopard', description: 'Party hard, wreck property, go fast, defy authority, and make sure everyone notices.' },
    { name: 'Pro Tech', description: 'Acquire, use, modify, and hack as much technology as possible. Tech is the future.' }
  ],
  [
    { name: 'First Church of Christ Computer Programmer', description: 'Friend Computer is not merely your friend but your god. Worship openly and often.' },
    { name: 'Psion', description: 'Mutant powers are humanity’s next step. Refine them and protect registered mutants.' }
  ],
  [
    { name: 'Frankenstein Destroyers', description: 'Bots are evil tools of oppression. Break, smash, and destroy them whenever possible.' },
    { name: 'Sierra Club', description: 'Escape the metal cage, reach the Outdoors, and bring pieces of it back with you.' }
  ]
];

const mutantPowerTable = [
  ['Adhesive Skin', 'Energy Field', 'Pyrokinesis'],
  ['Adrenalin Control', 'Hypersenses', 'Regeneration'],
  ['Bureaucratic Intuition', 'Levitation', 'Slippery Skin'],
  ['Chameleon', 'Machine Empathy', 'Telekinesis'],
  ['Charm', 'Matter Eater', 'Teleportation'],
  ['Electroshock', 'Mental Blast', 'X-Ray Vision']
];

const drugInteractionTable = [
  ['Your Lasers/Treason number increases by one.', 'Your Lasers/Treason number decreases by one.'],
  ['You feel a positive emotion—happiness, serenity, excitement, or loyalty—with overwhelming intensity.', 'You feel a negative emotion—fear, sadness, paranoia, or anger—with overwhelming intensity.'],
  ['Your mind becomes clear and focused; you are immune to mind-affecting abilities.', 'Your usual hormone suppression is suddenly and completely counteracted.'],
  ['Your mutation genes are suppressed; you cannot use or be affected by mutant powers.', 'Your mutant power activates repeatedly, randomly, and entirely on its own.'],
  ['You see beautiful, complex hallucinations and know they are not real.', 'You lose all color vision; Alpha Complex becomes black, white, and gray.'],
  ['Your left elbow itches slightly. Scratching it solves the problem.', 'You collapse screaming, frothing and seizing briefly before you die.']
];

const defaultState = {
  mode: 'player',
  character: {
    name: '', nameRoot: '', clearance: 'RED', homeSector: '', clone: '1', service: '', number: 3, goal: '', society: '', societyRoll: '', power: '', powerRoll: '',
    kit: { laser: true, armor: true, pdc: true, credit: true },
    log: ''
  },
  discord: { playerWebhook: '', dmWebhook: '' },
  special: { rdNumber: 3, rdResult: '', rdTone: 'idle', drugResult: '' },
  session: {
    phase: 'Mission alert',
    title: 'The music has stopped. That is treason.',
    copy: 'The harmonics in Sector 7-RED are collapsing. Restore the approved daycycle anthem before the entire sector discovers a dangerous, unsanctioned silence.',
    directive: 'Restore harmony',
    risk: 'B-7 Dance BOTS',
    status: 'Please resolve this issue with minimal noise, damage, and personal initiative.',
    clock: 2,
    clockLabel: 'Sector compliance',
    snapshotAt: null,
    // Keep actual secrets out of the static source bundle. These notes live only
    // in the DM's browser and are deliberately excluded from shared snapshots.
    secrets: ['', '', ''],
    incidents: ''
  }
};

const sparks = [
  '“The floor has detected unlicensed rhythm. Please remain perfectly still while it reclassifies your feet.”',
  'A mandatory morale parade arrives from the wrong direction, followed closely by its confused marching band.',
  'An INFRARED maintenance hatch opens. It contains a warm breeze, a field of grass, and one very guilty bot.',
  'Every citizen in the corridor receives a duplicate of the team’s last private conversation, formatted as a loyalty quiz.',
  'The sector’s dessert printer has developed a union. It demands a negotiator with clearance above its frosting.',
  'A helpful emergency shutter isolates the team with the thing it was trying to contain. The shutter begins apologizing.'
];

const tones = [
  'Cheerful bureaucracy · unsafe prototypes · friendly betrayal',
  'Overeager celebration · collapsing infrastructure · one bad secret',
  'Perfectly polished lies · tiny lasers · a very loud witness',
  'Mandatory happiness · accidental heroism · preventable fire',
  'Misfiled apocalypse · jealous bots · snack-based diplomacy'
];

const rdWords = {
  first: ['Harmony', 'Reverse', 'Polite', 'Negative', 'Singing', 'Ion', 'Emergency', 'Moral', 'Pocket', 'Quantum'],
  second: ['Compliance', 'Vortex', 'Bureaucracy', 'Cheer', 'Plasma', 'Chorus', 'Loyalty', 'Gravity', 'Friendship', 'Discipline'],
  third: ['Array', 'Cannon', 'Pills', 'Goggles', 'Grenade', 'Umbrella', 'Lubricant', 'Whistle', 'Sponge', 'Transponder'],
  use: [
    'Turns nearby machinery toward a single, approved purpose. It is learning sarcasm.',
    'Makes an elegant duplicate of any safety procedure. Only one of them can be followed safely.',
    'Detects disloyal vibrations in a ten-metre radius, including applause and several kinds of breathing.',
    'Compresses a problem into a smaller, more portable problem. The new problem may be sentient.',
    'Promotes team cohesion by giving every nearby object an opinion about the team.'
  ]
};

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return clone(defaultState);
    const loaded = {
      ...clone(defaultState), ...stored,
      character: { ...clone(defaultState).character, ...(stored.character || {}), kit: { ...clone(defaultState).character.kit, ...(stored.character?.kit || {}) } },
      discord: { ...clone(defaultState).discord, ...(stored.discord || {}) },
      special: { ...clone(defaultState).special, ...(stored.special || {}) },
      session: { ...clone(defaultState).session, ...(stored.session || {}), secrets: Array.isArray(stored.session?.secrets) ? stored.session.secrets : clone(defaultState).session.secrets }
    };
    migrateCharacter(loaded.character);
    return loaded;
  } catch { return clone(defaultState); }
}

let state = loadState();
let rollType = 'lasers';
let baseDice = 1;
let bonusSkill = false;
let bonusStyle = false;
let activeSecret = 0;
let creationStep = 1;
let toastTimer;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3100);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function migrateCharacter(character) {
  if (!clearanceCodes[character.clearance]) character.clearance = 'RED';
  character.clone = String(Math.min(6, Math.max(1, Number(character.clone) || 1)));
  character.homeSector = String(character.homeSector || '').replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase();
  if (!character.nameRoot && character.name) {
    const legacy = String(character.name).match(/^(.+)-([A-Z])-([A-Z0-9]{1,3})-(\d)$/i);
    if (legacy) {
      const clearance = Object.entries(clearanceCodes).find(([, code]) => code === legacy[2].toUpperCase());
      character.nameRoot = legacy[1];
      character.clearance = clearance?.[0] || 'RED';
      character.homeSector = legacy[3].toUpperCase();
      character.clone = legacy[4];
    } else {
      character.nameRoot = String(character.name).slice(0, 24);
    }
  }
  // This one-shot is explicitly RED clearance. Older local saves are brought
  // back into the available mission tier when the app loads.
  character.clearance = 'RED';
  character.societyRoll = String(character.societyRoll || '');
  character.powerRoll = String(character.powerRoll || '');
  if (!secretSocietyTable.flat().some(entry => entry.name === character.society)) character.society = '';
  if (!mutantPowerTable.flat().includes(character.power)) character.power = '';
}

function characterDesignation(character = state.character) {
  const root = String(character.nameRoot || '').trim();
  if (!root) return character.name || 'UNREGISTERED';
  const clearance = clearanceCodes[character.clearance] || 'R';
  const sector = String(character.homeSector || '').trim().toUpperCase() || '???';
  return `${root}-${clearance}-${sector}-${character.clone || '1'}`;
}

function syncCharacterDesignation() {
  state.character.name = characterDesignation();
  const designation = state.character.name;
  const record = $('#character-name');
  const creator = $('#creator-designation');
  if (record) record.textContent = designation;
  if (creator) creator.textContent = designation;
}

function phaseLabel(phase) {
  return phase.replace(/^The /, '').replace(/\b\w/g, letter => letter.toUpperCase());
}

function snapshotLabel(snapshotAt) {
  const date = new Date(snapshotAt || '');
  if (Number.isNaN(date.getTime())) return 'LOCAL BRIEF';
  return `SNAP ${new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(date)}`;
}

function updatePlayerBrief() {
  const s = state.session;
  $('#ticker-phase').textContent = s.phase.toUpperCase();
  $('#ticker-objective').textContent = s.directive.toUpperCase();
  const escapedTitle = escapeHTML(s.title.trim());
  const sentenceBreak = escapedTitle.indexOf('. ');
  if (sentenceBreak !== -1) {
    $('#player-scene-title').innerHTML = `${escapedTitle.slice(0, sentenceBreak + 1)}<br><span>${escapedTitle.slice(sentenceBreak + 2)}</span>`;
  } else {
    // A title without a sentence break gets a strong visual beat around its final phrase.
    const words = escapedTitle.split(' ');
    const splitAt = Math.max(1, Math.floor(words.length * .58));
    $('#player-scene-title').innerHTML = `${words.slice(0, splitAt).join(' ')}<br><span>${words.slice(splitAt).join(' ')}</span>`;
  }
  $('#player-scene-copy').textContent = s.copy;
  $('#player-directive').textContent = s.directive;
  $('#player-risk').textContent = s.risk;
  $('#player-phase-display').textContent = phaseLabel(s.phase);
  $('#player-clock-label').textContent = s.clockLabel;
  $('#player-clock-text').textContent = `${s.clock} / 6`;
  $('#player-clock-bar').style.width = `${(s.clock / 6) * 100}%`;
  $('#player-clock-progress').setAttribute('aria-label', s.clockLabel);
  $('#player-clock-progress').setAttribute('aria-valuenow', String(s.clock));
  $('#player-clock-progress').setAttribute('aria-valuetext', `${s.clockLabel} ${s.clock} of 6`);
  $('#player-snapshot-label').textContent = snapshotLabel(s.snapshotAt);
  $('#player-status-note').textContent = s.status;
}

function updateCharacterForm() {
  const c = state.character;
  syncCharacterDesignation();
  $('#character-root').value = c.nameRoot;
  $('#security-clearance').value = c.clearance;
  $('#home-sector').value = c.homeSector;
  $('#clone-count').value = c.clone;
  $('#service-group').value = c.service;
  $('#personal-goal').value = c.goal;
  $('#field-log-input').value = c.log;
  $('#log-count').textContent = `${c.log.length} / 1400`;
  $$('.number-option').forEach(button => {
    const selected = Number(button.dataset.number) === c.number;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-checked', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $('#number-output').textContent = c.number;
  $('#roll-number-reference').textContent = c.number;
  $$('[data-kit]').forEach(input => { input.checked = Boolean(c.kit[input.dataset.kit]); });
  updateRestrictedFactorForms();
}

function updateCreatorForm() {
  const c = state.character;
  $('#creator-clearance').value = c.clearance;
  $('#creator-service').value = c.service;
  $('#creator-name-root').value = c.nameRoot;
  $('#creator-home-sector').value = c.homeSector;
  $('#creator-clone-count').value = c.clone;
  $('#creator-goal').value = c.goal;
  $('#creator-number-output').textContent = c.number;
  $('#creator-designation').textContent = characterDesignation(c);
  $$('.creator-number-option').forEach(button => {
    const selected = Number(button.dataset.number) === c.number;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-checked', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $$('[data-creator-kit]').forEach(input => { input.checked = Boolean(c.kit[input.dataset.creatorKit]); });
  updateRestrictedFactorForms();
}

function updateRestrictedFactorForms() {
  const c = state.character;
  const society = secretSocietyTable.flat().find(entry => entry.name === c.society);
  const societyName = society?.name || 'UNASSIGNED';
  const societyRoll = c.societyRoll || 'ROLL 1d6 COLUMN + 1d6 ROW';
  const societyDescription = society?.description || 'The dice will assign the affiliation. Choosing is treasonously convenient.';
  const powerName = c.power || 'UNASSIGNED';
  const powerRoll = c.powerRoll || 'ROLL 1d6 COLUMN + 1d6 ROW';
  const powerDescription = c.power ? 'Practice and improve this treasonous ability without being observed.' : 'The dice will assign the mutation. Friend Computer is already concerned.';

  ['secret-society', 'creator-society'].forEach(id => { $(`#${id}`).textContent = societyName; });
  ['society-roll-detail', 'creator-society-roll-detail'].forEach(id => { $(`#${id}`).textContent = societyRoll; });
  ['society-description', 'creator-society-description'].forEach(id => { $(`#${id}`).textContent = societyDescription; });
  ['mutant-power', 'creator-power'].forEach(id => { $(`#${id}`).textContent = powerName; });
  ['power-roll-detail', 'creator-power-roll-detail'].forEach(id => { $(`#${id}`).textContent = powerRoll; });
  ['power-description', 'creator-power-description'].forEach(id => { $(`#${id}`).textContent = powerDescription; });
}

function discordWebhookValidation(value) {
  const raw = String(value || '').trim();
  if (!raw) return { empty: true, valid: false, url: '' };
  try {
    const url = new URL(raw);
    const hosts = ['discord.com', 'discordapp.com', 'canary.discord.com', 'ptb.discord.com'];
    const validPath = /^\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+$/.test(url.pathname);
    if (url.protocol !== 'https:' || !hosts.includes(url.hostname) || !validPath) return { empty: false, valid: false, url: raw };
    return { empty: false, valid: true, url: url.toString() };
  } catch { return { empty: false, valid: false, url: raw }; }
}

function setHookStatus(kind, message, tone = 'idle') {
  const status = $(`#${kind}-hook-status`);
  const light = $(`#${kind}-hook-light`);
  if (status) status.textContent = message;
  if (light) {
    light.className = `relay-light is-${tone}`;
    light.innerHTML = '<i></i>';
    light.append(document.createTextNode(tone === 'armed' ? ' armed' : tone === 'sending' ? ' sending' : tone === 'error' ? ' signal error' : ' local only'));
  }
}

function refreshHookStatus(kind) {
  const key = kind === 'player' ? 'playerWebhook' : 'dmWebhook';
  const check = discordWebhookValidation(state.discord[key]);
  if (check.empty) {
    setHookStatus(kind, kind === 'player' ? 'Paste a hook and this browser will announce your rolls.' : 'Paste a hook to post the current player briefing from this browser.');
  } else if (check.valid) {
    setHookStatus(kind, kind === 'player' ? 'Roll relay armed on this browser. The URL stays out of snapshots.' : 'Table relay armed on this browser. The URL stays out of snapshots.', 'armed');
  } else {
    setHookStatus(kind, 'That does not look like a Discord webhook URL.', 'error');
  }
}

function updateDiscordForm() {
  $('#player-webhook').value = state.discord.playerWebhook;
  $('#dm-webhook').value = state.discord.dmWebhook;
  refreshHookStatus('player');
  refreshHookStatus('dm');
}

function saveWebhook(kind, value) {
  const key = kind === 'player' ? 'playerWebhook' : 'dmWebhook';
  state.discord[key] = String(value || '').trim();
  save();
  refreshHookStatus(kind);
}

function forgetWebhook(kind) {
  const key = kind === 'player' ? 'playerWebhook' : 'dmWebhook';
  state.discord[key] = '';
  save();
  $(`#${kind}-webhook`).value = '';
  refreshHookStatus(kind);
  showToast('Webhook forgotten on this device. Friend Computer respects your discretion.');
}

function updateDMForm() {
  const s = state.session;
  $('#mission-phase').value = s.phase;
  $('#dm-scene-title').value = s.title;
  $('#dm-scene-copy').value = s.copy;
  $('#dm-directive').value = s.directive;
  $('#dm-risk').value = s.risk;
  $('#dm-status-note').value = s.status;
  $('#dm-clock-label').value = s.clockLabel;
  $('#dm-clock-value').textContent = s.clock;
  $('#clock-ring').style.setProperty('--progress', `${(s.clock / 6) * 100}%`);
  $('#clock-outcome').textContent = clockOutcome(s.clock);
  $('#incident-log').value = s.incidents;
  $('#incident-count').textContent = `${s.incidents.length} / 1400`;
  $('#secret-note').value = s.secrets[activeSecret] || '';
  $('#secret-note-label').textContent = ['TWIST NOTE', 'NPC NOTE', 'EVIDENCE NOTE'][activeSecret];
}

function clockOutcome(clock) {
  const outcomes = [
    'At 0: the sector is almost deceptively calm. Set something in motion.',
    'At 1: the problem is visible only to people who know where to look.',
    'At 2: someone has noticed. They are filing a complaint in triplicate.',
    'At 3: the official solution starts causing a new problem.',
    'At 4: containment is now louder than the original emergency.',
    'At 5: Friend Computer requests a reassuring progress report immediately.',
    'At 6: an entire sector gets the melody wrong. Friend Computer notices.'
  ];
  return outcomes[clock] || outcomes[6];
}

function updateRollControls() {
  const total = Math.max(1, baseDice + (bonusSkill ? 1 : 0) + (bonusStyle ? 1 : 0));
  $('#dice-count').textContent = `${total}d6`;
  $('#remove-die').disabled = baseDice <= 1;
  $('#remove-die').setAttribute('aria-disabled', String(baseDice <= 1));
  $('#roll-button-label').textContent = rollType.toUpperCase();
  $$('.roll-type').forEach(button => {
    const active = button.dataset.rollType === rollType;
    button.classList.toggle('active', active);
    button.setAttribute('aria-checked', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  $('#skill-bonus').classList.toggle('active', bonusSkill);
  $('#style-bonus').classList.toggle('active', bonusStyle);
  $('#skill-bonus').setAttribute('aria-pressed', String(bonusSkill));
  $('#style-bonus').setAttribute('aria-pressed', String(bonusStyle));
  return total;
}

function renderAll() {
  updatePlayerBrief();
  updateCharacterForm();
  updateCreatorForm();
  updateDMForm();
  updateDiscordForm();
  updateRollControls();
  updateSpecialRolls();
}

function setMode(mode, shouldScroll = false) {
  state.mode = mode;
  save();
  const player = mode === 'player';
  $('#player-view').classList.toggle('is-active', player);
  $('#gm-view').classList.toggle('is-active', !player);
  $('#player-view').hidden = !player;
  $('#gm-view').hidden = player;
  $$('.mode-button').forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  if (shouldScroll) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

function setCharacterField(key, value) {
  const normalized = key === 'homeSector' ? String(value).replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase() : value;
  state.character[key] = normalized;
  syncCharacterDesignation();
  save();
  return normalized;
}

function characterInput(key, event) {
  const value = setCharacterField(key, event.target.value);
  if (event.target.value !== value) event.target.value = value;
}

function chooseClearance(event, source) {
  const select = event.target;
  if (select.value !== 'RED') {
    state.character.clearance = 'RED';
    save();
    updateCharacterForm();
    updateCreatorForm();
    select.setAttribute('aria-invalid', 'true');
    if (source === 'creator') {
      creatorError('UNAVAILABLE // This one-shot is RED clearance only. Higher and lower access tiers have been patriotically disabled.');
    } else {
      const error = $('#clearance-error');
      error.hidden = false;
      showToast('UNAVAILABLE // RED clearance citizens only.');
    }
    return;
  }
  select.removeAttribute('aria-invalid');
  setCharacterField('clearance', 'RED');
  updateCharacterForm();
  updateCreatorForm();
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollRestrictedFactor(kind) {
  const columnRoll = rollD6();
  const rowRoll = rollD6();
  if (kind === 'society') {
    const column = columnRoll <= 3 ? 0 : 1;
    const result = secretSocietyTable[rowRoll - 1][column];
    state.character.society = result.name;
    state.character.societyRoll = `COLUMN ${columnRoll} / ROW ${rowRoll}`;
    showToast(`Restricted affiliation assigned: ${result.name}.`);
  } else {
    const column = Math.floor((columnRoll - 1) / 2);
    state.character.power = mutantPowerTable[rowRoll - 1][column];
    state.character.powerRoll = `COLUMN ${columnRoll} / ROW ${rowRoll}`;
    showToast(`Mutant power assigned: ${state.character.power}. Please remain calm.`);
  }
  save();
  updateCharacterForm();
  updateCreatorForm();
}

function updateSpecialRolls() {
  const special = state.special;
  $('#rd-safe-useful-number').value = String(special.rdNumber);
  $('#rd-number').textContent = special.rdNumber;
  const rdText = special.rdResult || 'Awaiting a one-die field test. No bonuses and no assistance.';
  ['rd-special-result', 'dm-rd-roll-result'].forEach(id => {
    const output = $(`#${id}`);
    output.textContent = rdText;
    output.className = `special-result is-${special.rdTone || 'idle'}`;
  });
  const drugOutput = $('#drug-roll-result');
  drugOutput.textContent = special.drugResult || 'Awaiting an inadvisable pharmaceutical interaction.';
  drugOutput.className = `special-result ${special.drugResult ? 'is-useful' : 'is-idle'}`;
}

function setRDNumber(value) {
  state.special.rdNumber = Math.max(2, Math.min(5, Number(value) || 3));
  state.special.rdResult = '';
  state.special.rdTone = 'idle';
  save();
  updateSpecialRolls();
}

function rollRDItem() {
  const die = rollD6();
  const number = state.special.rdNumber;
  let outcome;
  if (die < number) {
    outcome = 'SAFE // It does something Safe, whether or not that helps.';
    state.special.rdTone = 'safe';
  } else if (die > number) {
    outcome = 'USEFUL // It does something Useful, whether or not that is survivable.';
    state.special.rdTone = 'useful';
  } else {
    outcome = 'SAFELY USEFUL // It does something both Safe and Useful. Congratulations are mandatory.';
    state.special.rdTone = 'exact';
  }
  state.special.rdResult = `ROLLED ${die} AGAINST ${number} // ${outcome}`;
  save();
  updateSpecialRolls();
  showToast(`R&D field test rolled ${die}: ${outcome.split(' // ')[0]}.`);
}

function mixDrugs() {
  const columnRoll = rollD6();
  const rowRoll = rollD6();
  const column = columnRoll <= 3 ? 0 : 1;
  const effect = drugInteractionTable[rowRoll - 1][column];
  state.special.drugResult = `COLUMN ${columnRoll} / ROW ${rowRoll} // ${effect}`;
  save();
  updateSpecialRolls();
  showToast('Pharmaceutical interaction resolved. Medical supervision remains unavailable.');
}

function sessionInput(key, event) {
  state.session[key] = event.target.value;
  save();
  updatePlayerBrief();
}

function rollFlavor(type, successes, exact) {
  if (exact >= 3) return 'Friend Computer records your heroism, then places the whole sector on a very small watchlist.';
  if (exact > 0) return 'Friend Computer accepts the success and begins filling out the incident report before you can object.';
  if (successes === 0) return type === 'lasers'
    ? 'Your technical plan emits one sad, traitorous beep. This is not a reflection on your value.'
    : 'Your unapproved instinct leads directly into a very official-looking problem.';
  if (successes === 1) return 'A nearby terminal offers a single, grudgingly green checkmark.';
  if (successes === 2) return 'Competence detected. Please do not make a habit of it.';
  return 'Your excellence has been flagged as statistically suspicious. Maintain your innocence.';
}

function rollDice() {
  const total = updateRollControls();
  const number = state.character.number;
  const dice = Array.from({ length: total }, () => Math.floor(Math.random() * 6) + 1);
  const isSuccess = die => rollType === 'lasers' ? die > number : die < number;
  const successes = dice.filter(die => isSuccess(die) || die === number).length;
  const exact = dice.filter(die => die === number).length;
  const outcome = successes === 0 ? 'The situation gets worse.' : successes === 1 ? 'You succeed, barely.' : successes === 2 ? 'You do it, adequately.' : 'Almost suspiciously perfect.';
  const complication = exact === 0 ? '' : exact === 1 ? 'One exact die: something goes wrong.' : exact === 2 ? 'Two exact dice: something goes very wrong.' : `${exact} exact dice: something goes horribly wrong.`;
  const flavor = rollFlavor(rollType, successes, exact);
  const report = { type: rollType, number, dice, total, successes, exact, outcome, complication, flavor, name: characterDesignation() };
  const diceMarkup = dice.map(die => `<span class="die ${die === number ? 'exact' : isSuccess(die) ? 'success' : ''}">${die}</span>`).join('');
  $('#roll-result').className = 'roll-result has-result';
  $('#roll-result').innerHTML = `
    <div class="result-summary"><b>${successes} ${successes === 1 ? 'success' : 'successes'}</b><span>${escapeHTML(outcome)}</span></div>
    <div class="die-row" aria-label="Rolled dice">${diceMarkup}</div>
    <p class="result-note">${exact ? `<b>TREASONOUS LASER.</b> ${escapeHTML(complication)}` : 'No exact hits. Friend Computer approves this statistically ordinary behavior.'}</p>
    <p class="result-flavor"><span>TERMINAL COMMENT</span>${escapeHTML(flavor)}</p>`;
  void announcePlayerRoll(report);
  return report;
}

function discordEmbed(title, description, color, fields = []) {
  return {
    username: 'FRIEND COMPUTER',
    allowed_mentions: { parse: [] },
    embeds: [{
      title: String(title).slice(0, 256),
      description: String(description).slice(0, 4096),
      color,
      fields: fields.map(field => ({ name: String(field.name).slice(0, 256), value: String(field.value || '—').slice(0, 1024), inline: Boolean(field.inline) })),
      footer: { text: 'ALPHA COMPLEX // FRIEND COMPUTER IS PLEASED' },
      timestamp: new Date().toISOString()
    }]
  };
}

function rollDiscordPayload(report) {
  const color = report.successes === 0 ? 0xd13f3f : report.exact ? 0xe8b947 : 0x4bd66a;
  return discordEmbed(
    `${report.type.toUpperCase()} CHECK // ${report.name}`,
    report.flavor,
    color,
    [
      { name: 'DICE', value: report.dice.map(die => `[${die}]`).join(' '), inline: true },
      { name: 'RESULT', value: `${report.successes} ${report.successes === 1 ? 'success' : 'successes'} — ${report.outcome}`, inline: true },
      { name: report.exact ? 'TREASONOUS LASER' : 'COMPUTER ASSESSMENT', value: report.exact ? report.complication : 'No abnormality detected. Carry on, citizen.' }
    ]
  );
}

function briefingDiscordPayload() {
  const s = state.session;
  return discordEmbed(
    `MISSION UPDATE // ${s.phase.toUpperCase()}`,
    s.copy,
    0x4bd66a,
    [
      { name: 'DIRECTIVE', value: s.directive, inline: true },
      { name: 'IMMEDIATE RISK', value: s.risk, inline: true },
      { name: `${s.clockLabel.toUpperCase()} CLOCK`, value: `${s.clock} / 6`, inline: true },
      { name: 'FRIENDLY REMINDER', value: s.status }
    ]
  );
}

async function postDiscordWebhook(kind, payload) {
  const key = kind === 'player' ? 'playerWebhook' : 'dmWebhook';
  const check = discordWebhookValidation(state.discord[key]);
  if (!check.valid) throw new Error(check.empty ? 'No webhook pasted.' : 'Invalid Discord webhook URL.');
  const response = await fetch(check.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Discord returned ${response.status}.`);
}

async function testDiscordWebhook(kind) {
  const key = kind === 'player' ? 'playerWebhook' : 'dmWebhook';
  const check = discordWebhookValidation(state.discord[key]);
  if (!check.valid) {
    refreshHookStatus(kind);
    showToast(check.empty ? 'Paste a Discord webhook first.' : 'That webhook URL is not valid.');
    return;
  }
  setHookStatus(kind, 'Opening a secure-ish channel to Friend Computer…', 'sending');
  try {
    await postDiscordWebhook(kind, discordEmbed('RELAY TEST // CONNECTION ACCEPTED', 'This webhook has been configured by a loyal citizen. Friend Computer appreciates the initiative.', 0x4bd66a));
    setHookStatus(kind, 'Signal received. Friend Computer is listening.', 'armed');
    showToast('Discord relay test delivered.');
  } catch (error) {
    setHookStatus(kind, `${error.message} Check the webhook and try again.`, 'error');
    showToast('Discord could not receive the test.');
  }
}

async function announcePlayerRoll(report) {
  if (!discordWebhookValidation(state.discord.playerWebhook).valid) return;
  setHookStatus('player', 'Filing your roll with Friend Computer…', 'sending');
  try {
    await postDiscordWebhook('player', rollDiscordPayload(report));
    setHookStatus('player', 'Roll delivered. Friend Computer has noticed.', 'armed');
  } catch (error) {
    setHookStatus('player', `${error.message} Your roll still exists locally.`, 'error');
    showToast('Roll recorded here; Discord delivery failed.');
  }
}

async function postBriefingToDiscord() {
  const check = discordWebhookValidation(state.discord.dmWebhook);
  if (!check.valid) {
    refreshHookStatus('dm');
    showToast(check.empty ? 'Paste a Discord webhook first.' : 'That webhook URL is not valid.');
    return;
  }
  setHookStatus('dm', 'Broadcasting current briefing…', 'sending');
  try {
    await postDiscordWebhook('dm', briefingDiscordPayload());
    setHookStatus('dm', 'Briefing delivered. The table has been informed.', 'armed');
    showToast('Current briefing posted to Discord.');
  } catch (error) {
    setHookStatus('dm', `${error.message} Check the webhook and try again.`, 'error');
    showToast('Discord could not receive the briefing.');
  }
}

function makeBriefPayload() {
  const { phase, title, copy, directive, risk, status, clock, clockLabel } = state.session;
  return { phase, title, copy, directive, risk, status, clock, clockLabel, snapshotAt: new Date().toISOString() };
}

function toBase64(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64(value) {
  const base = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base + '='.repeat((4 - base.length % 4) % 4);
  const binary = atob(pad);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function snapshotLink(payload = makeBriefPayload()) {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#brief=${toBase64(payload)}`;
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.append(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    showToast(copied ? successMessage : 'Copy failed — select the briefing details manually.');
  }
}

function copySnapshot() {
  const payload = makeBriefPayload();
  state.session.snapshotAt = payload.snapshotAt;
  save();
  updatePlayerBrief();
  return copyText(snapshotLink(payload), 'Player snapshot copied — drop it in your group chat.');
}

function copyMissionBrief() {
  const s = state.session;
  const text = `LASERS & TREASON // ${s.phase.toUpperCase()}\n${s.title}\n\n${s.copy}\n\nDIRECTIVE: ${s.directive}\nRISK: ${s.risk}\n${s.clockLabel.toUpperCase()}: ${s.clock}/6\n\n${s.status}`;
  return copyText(text, 'Mission brief copied.');
}

function readBriefHash() {
  const match = window.location.hash.match(/^#brief=([A-Za-z0-9_-]+)$/);
  if (!match) return false;
  try {
    const brief = fromBase64(match[1]);
    if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return false;
    if (typeof brief.phase === 'string' && missionPhases.includes(brief.phase)) state.session.phase = brief.phase;
    const textFields = { title: 76, copy: 420, directive: 50, risk: 50, status: 150, clockLabel: 38 };
    Object.entries(textFields).forEach(([key, limit]) => {
      if (typeof brief[key] === 'string') state.session[key] = brief[key].slice(0, limit);
    });
    const clock = typeof brief.clock === 'number' ? brief.clock : typeof brief.clock === 'string' && /^\d+$/.test(brief.clock) ? Number(brief.clock) : Number.NaN;
    if (Number.isFinite(clock)) state.session.clock = Math.max(0, Math.min(6, Math.round(clock)));
    if (typeof brief.snapshotAt === 'string' && !Number.isNaN(new Date(brief.snapshotAt).getTime())) state.session.snapshotAt = brief.snapshotAt;
    save();
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    return true;
  } catch { return false; }
}

function choose(array) { return array[Math.floor(Math.random() * array.length)]; }
function prefersReducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

function bindRadioKeyboard(selector, onSelect) {
  const buttons = $$(selector);
  buttons.forEach((button, index) => button.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = buttons.length - 1;
    const next = buttons[nextIndex];
    onSelect(next);
    next.focus();
  }));
}

function showCreatorStep(step) {
  creationStep = Math.min(creationSteps.length, Math.max(1, step));
  const current = creationSteps[creationStep - 1];
  $$('.creator-step').forEach(section => {
    const active = Number(section.dataset.creatorStep) === creationStep;
    section.hidden = !active;
    section.classList.toggle('is-active', active);
  });
  $('#creator-step-count').textContent = `STEP ${creationStep} / ${creationSteps.length}`;
  $('#creator-kicker').textContent = current.kicker;
  $('#creator-title').textContent = current.title;
  $('#creator-description').textContent = current.description;
  $('#creator-progress-bar').style.width = `${(creationStep / creationSteps.length) * 100}%`;
  $('#creator-back').disabled = creationStep === 1;
  $('#creator-next').innerHTML = creationStep === creationSteps.length ? 'Complete record <span aria-hidden="true">✓</span>' : `${current.next} <span aria-hidden="true">→</span>`;
  $('#creator-error').hidden = true;
}

function creatorError(message) {
  const error = $('#creator-error');
  error.textContent = message;
  error.hidden = false;
}

function validateCreatorStep() {
  if (creationStep === 2 && !state.character.service) {
    creatorError('Select a Service Group. Friend Computer needs to know how you might be useful.');
    $('#creator-service').focus();
    return false;
  }
  if (creationStep === 5) {
    if (!String(state.character.nameRoot || '').trim()) {
      creatorError('A clone needs a name root. Even a very temporary clone.');
      $('#creator-name-root').focus();
      return false;
    }
    if (!String(state.character.homeSector || '').trim()) {
      creatorError('Enter a one-to-three character home subsector designation.');
      $('#creator-home-sector').focus();
      return false;
    }
  }
  return true;
}

function openCreator() {
  updateCreatorForm();
  showCreatorStep(1);
  const dialog = $('#creation-dialog');
  if (!dialog.open) dialog.showModal();
  window.setTimeout(() => $('#creator-clearance').focus(), 0);
}

function closeCreator() {
  $('#creation-dialog').close();
  updateCharacterForm();
}

function advanceCreator() {
  if (!validateCreatorStep()) return;
  if (creationStep === creationSteps.length) {
    syncCharacterDesignation();
    save();
    closeCreator();
    showToast(`Personnel record complete: ${state.character.name}. Friend Computer approves.`);
    return;
  }
  showCreatorStep(creationStep + 1);
  const focusTarget = $(`[data-creator-step="${creationStep}"] input, [data-creator-step="${creationStep}"] select, [data-creator-step="${creationStep}"] button`);
  if (focusTarget) focusTarget.focus();
}

function bootApplication() {
  const screen = $('#boot-screen');
  const appShell = $('#app-shell');
  const acknowledge = $('#boot-ack');
  const lines = $$('.boot-line');
  let ready = false;
  let finished = false;
  const timers = [];
  const prepare = () => {
    if (ready) return;
    ready = true;
    acknowledge.disabled = false;
    acknowledge.textContent = 'PRESS ENTER TO BEGIN';
    screen.classList.add('is-ready');
    acknowledge.focus();
  };
  const finish = () => {
    if (!ready || finished) return;
    finished = true;
    timers.forEach(timer => window.clearTimeout(timer));
    screen.classList.add('is-leaving');
    document.body.classList.remove('booting');
    appShell.inert = false;
    window.setTimeout(() => {
      screen.hidden = true;
      $('#player-mode-button').focus();
      window.dispatchEvent(new Event('friend-computer:ready'));
    }, prefersReducedMotion() ? 0 : 260);
  };
  if (prefersReducedMotion()) {
    lines.forEach(line => line.classList.add('is-visible'));
    prepare();
  } else {
    lines.forEach((line, index) => timers.push(window.setTimeout(() => line.classList.add('is-visible'), 180 + index * 245)));
    timers.push(window.setTimeout(prepare, 1260));
  }
  acknowledge.addEventListener('click', finish);
  window.addEventListener('keydown', event => {
    if (ready && !finished && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      finish();
    }
  });
}

function generateSpark() { $('#spark-display p').textContent = choose(sparks); }
function generateRD() {
  const name = `${choose(rdWords.first)} ${choose(rdWords.second)} ${choose(rdWords.third)}`;
  const description = choose(rdWords.use);
  const number = Math.floor(Math.random() * 4) + 2;
  $('#rd-name').textContent = name;
  $('#rd-description').textContent = description;
  state.special.rdNumber = number;
  state.special.rdResult = '';
  state.special.rdTone = 'idle';
  save();
  updateSpecialRolls();
}

function bindEvents() {
  $$('.mode-button').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode, true)));
  bindRadioKeyboard('.mode-button', button => setMode(button.dataset.mode));
  $$('[data-scroll-to]').forEach(button => button.addEventListener('click', () => $(`#${button.dataset.scrollTo}`).scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })));

  $('#character-root').addEventListener('input', event => characterInput('nameRoot', event));
  $('#security-clearance').addEventListener('change', event => chooseClearance(event, 'main'));
  $('#home-sector').addEventListener('input', event => characterInput('homeSector', event));
  $('#clone-count').addEventListener('change', event => { setCharacterField('clone', event.target.value); syncCharacterDesignation(); });
  $('#service-group').addEventListener('change', event => characterInput('service', event));
  $('#personal-goal').addEventListener('input', event => characterInput('goal', event));
  $('#roll-secret-society').addEventListener('click', () => rollRestrictedFactor('society'));
  $('#roll-mutant-power').addEventListener('click', () => rollRestrictedFactor('power'));
  $('#copy-designation').addEventListener('click', () => copyText(characterDesignation(), 'Designation copied for official use.'));
  $('#open-creator').addEventListener('click', openCreator);
  $('#make-troubleshooter').addEventListener('click', openCreator);
  $('#field-log-input').addEventListener('input', event => {
    characterInput('log', event);
    $('#log-count').textContent = `${event.target.value.length} / 1400`;
  });
  $('#clear-log').addEventListener('click', () => {
    if (!state.character.log) return;
    state.character.log = ''; save(); updateCharacterForm(); showToast('Field log cleared. The past is now unfiled.');
  });
  $$('.number-option').forEach(button => button.addEventListener('click', () => {
    state.character.number = Number(button.dataset.number); save(); updateCharacterForm();
  }));
  bindRadioKeyboard('.number-option', button => { state.character.number = Number(button.dataset.number); save(); updateCharacterForm(); });
  $$('[data-kit]').forEach(input => input.addEventListener('change', event => { state.character.kit[event.target.dataset.kit] = event.target.checked; save(); }));

  $('#creator-clearance').addEventListener('change', event => chooseClearance(event, 'creator'));
  $('#creator-service').addEventListener('change', event => { setCharacterField('service', event.target.value); updateCharacterForm(); });
  $('#creator-name-root').addEventListener('input', event => { characterInput('nameRoot', event); updateCharacterForm(); });
  $('#creator-home-sector').addEventListener('input', event => { characterInput('homeSector', event); updateCharacterForm(); });
  $('#creator-clone-count').addEventListener('change', event => { setCharacterField('clone', event.target.value); updateCharacterForm(); });
  $('#creator-goal').addEventListener('input', event => { characterInput('goal', event); updateCharacterForm(); });
  $('#creator-roll-society').addEventListener('click', () => rollRestrictedFactor('society'));
  $('#creator-roll-power').addEventListener('click', () => rollRestrictedFactor('power'));
  $$('.creator-number-option').forEach(button => button.addEventListener('click', () => {
    state.character.number = Number(button.dataset.number); save(); updateCharacterForm(); updateCreatorForm();
  }));
  bindRadioKeyboard('.creator-number-option', button => { state.character.number = Number(button.dataset.number); save(); updateCharacterForm(); updateCreatorForm(); });
  $$('[data-creator-kit]').forEach(input => input.addEventListener('change', event => {
    state.character.kit[event.target.dataset.creatorKit] = event.target.checked;
    save();
    $$(`[data-kit="${event.target.dataset.creatorKit}"]`).forEach(mainInput => { mainInput.checked = event.target.checked; });
  }));
  $('#creator-back').addEventListener('click', () => showCreatorStep(creationStep - 1));
  $('#creator-next').addEventListener('click', advanceCreator);
  $('#close-creator').addEventListener('click', closeCreator);
  $('#creation-dialog').addEventListener('click', event => { if (event.target === $('#creation-dialog')) closeCreator(); });

  $$('.roll-type').forEach(button => button.addEventListener('click', () => { rollType = button.dataset.rollType; updateRollControls(); }));
  bindRadioKeyboard('.roll-type', button => { rollType = button.dataset.rollType; updateRollControls(); });
  $('#add-die').addEventListener('click', () => { baseDice = Math.min(8, baseDice + 1); updateRollControls(); });
  $('#remove-die').addEventListener('click', () => { baseDice = Math.max(1, baseDice - 1); updateRollControls(); });
  $('#skill-bonus').addEventListener('click', () => { bonusSkill = !bonusSkill; updateRollControls(); });
  $('#style-bonus').addEventListener('click', () => { bonusStyle = !bonusStyle; updateRollControls(); });
  $('#roll-button').addEventListener('click', rollDice);
  $('#rd-safe-useful-number').addEventListener('change', event => setRDNumber(event.target.value));
  $('#roll-rd-item').addEventListener('click', rollRDItem);
  $('#roll-drug-interaction').addEventListener('click', mixDrugs);
  $('#copy-player-brief').addEventListener('click', copyMissionBrief);
  $('#player-webhook').addEventListener('input', event => saveWebhook('player', event.target.value));
  $('#test-player-webhook').addEventListener('click', () => testDiscordWebhook('player'));
  $('#clear-player-webhook').addEventListener('click', () => forgetWebhook('player'));

  $('#mission-phase').addEventListener('change', event => sessionInput('phase', event));
  $('#dm-scene-title').addEventListener('input', event => sessionInput('title', event));
  $('#dm-scene-copy').addEventListener('input', event => sessionInput('copy', event));
  $('#dm-directive').addEventListener('input', event => sessionInput('directive', event));
  $('#dm-risk').addEventListener('input', event => sessionInput('risk', event));
  $('#dm-status-note').addEventListener('input', event => sessionInput('status', event));
  $('#dm-clock-label').addEventListener('input', event => sessionInput('clockLabel', event));
  $('#clock-up').addEventListener('click', () => { state.session.clock = Math.min(6, state.session.clock + 1); save(); renderAll(); });
  $('#clock-down').addEventListener('click', () => { state.session.clock = Math.max(0, state.session.clock - 1); save(); renderAll(); });
  $('#reset-clock').addEventListener('click', () => { state.session.clock = 0; save(); renderAll(); showToast('Compliance clock reset. Suspiciously forgiving.'); });
  $('#share-brief').addEventListener('click', copySnapshot);
  $('#open-player-preview').addEventListener('click', () => setMode('player', true));
  $('#dm-webhook').addEventListener('input', event => saveWebhook('dm', event.target.value));
  $('#test-dm-webhook').addEventListener('click', () => testDiscordWebhook('dm'));
  $('#post-briefing').addEventListener('click', postBriefingToDiscord);
  $('#clear-dm-webhook').addEventListener('click', () => forgetWebhook('dm'));

  $('#generate-spark').addEventListener('click', generateSpark);
  $('#copy-spark').addEventListener('click', () => copyText($('#spark-display p').textContent, 'Complication copied.'));
  $('#add-spark-log').addEventListener('click', () => {
    const line = `[COMPLICATION] ${$('#spark-display p').textContent}`;
    state.session.incidents = state.session.incidents ? `${state.session.incidents}\n${line}` : line;
    save(); updateDMForm(); showToast('Added to the incident log.');
  });
  $('#generate-rd').addEventListener('click', generateRD);
  $('#roll-rd-dm').addEventListener('click', rollRDItem);
  $$('.secret-tab').forEach(button => button.addEventListener('click', () => {
    activeSecret = Number(button.dataset.secret);
    $$('.secret-tab').forEach(tab => { const selected = Number(tab.dataset.secret) === activeSecret; tab.classList.toggle('active', selected); tab.setAttribute('aria-pressed', String(selected)); });
    updateDMForm();
  }));
  $('#secret-note').addEventListener('input', event => { state.session.secrets[activeSecret] = event.target.value; save(); });
  $('#incident-log').addEventListener('input', event => { state.session.incidents = event.target.value; save(); $('#incident-count').textContent = `${event.target.value.length} / 1400`; });
  $('#clear-incidents').addEventListener('click', () => { if (!state.session.incidents) return; state.session.incidents = ''; save(); updateDMForm(); showToast('Incident log cleared. An unusual lack of accountability.'); });
  $('#random-tone').addEventListener('click', () => { $('.dm-cue-card p').textContent = choose(tones); });

  const dialog = $('#help-dialog');
  $('#sharing-help').addEventListener('click', () => dialog.showModal());
  $('#close-help').addEventListener('click', () => dialog.close());
  $('#dialog-copy-brief').addEventListener('click', () => copySnapshot());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

const importedBrief = readBriefHash();
renderAll();
bindEvents();
setMode(state.mode);
if (importedBrief) {
  setMode('player');
  window.addEventListener('friend-computer:ready', () => showToast('Shared player briefing loaded.'), { once: true });
}
bootApplication();
