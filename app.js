/* Lasers & Treason FCOS Toolbox // dependency-free by design for GitHub Pages. */

const STORAGE_KEY = 'lasers-treason-mission-control-v1';
const clearanceCodes = { ULTRAVIOLET: 'U', VIOLET: 'V', INDIGO: 'N', BLUE: 'B', GREEN: 'G', YELLOW: 'Y', ORANGE: 'O', RED: 'R', INFRARED: 'I' };
const creationSteps = [
  { kicker: '01 // CLEARANCE', title: 'Know your color.', description: 'Your clearance determines which equipment and sectors you may legally use. The current mission is tuned for RED clearance, citizen.', next: 'Choose service' },
  { kicker: '02 // SERVICE GROUP', title: 'Remember your useful former life.', description: 'Your service background may add +1d6 to a risky action when it honestly helps. No two Troubleshooters pick the same group.', next: 'Declare restrictions' },
  { kicker: '03 // RESTRICTED FACTORS', title: 'Submit to random screening.', description: 'Roll once on each restricted table. Secret societies and mutant powers are assigned by the dice; loyal citizens do not shop around.', next: 'Set your number' },
  { kicker: '04 // LASERS / TREASON', title: 'Calibrate your instincts.', description: 'Choose a number from 2 to 5. Low means you are better at Lasers; high means you are better at Treason.', next: 'Register your clone' },
  { kicker: '05 // DESIGNATION', title: 'Give your clone a name.', description: 'Use the approved format: Name-Clearance Letter-Home Subsector-Clone Number. Friend Computer has generously issued six clones.', next: 'Accept equipment' },
  { kicker: '06 // STANDARD ISSUE', title: 'Accept your property.', description: 'Friend Computer has issued this useful equipment for mission success. It would be ungrateful to misplace any of it.', next: 'Receive orders' },
  { kicker: '07 // STANDING ORDERS', title: 'Become useful.', description: 'Add an optional personal imperative. Succeed in the mission, find trouble, and report treason. Friend Computer believes in you.', next: 'Complete record' }
];

const secretSocietyTable = [
  [
    { name: 'Anti-Mutant', description: 'Hunt mutants on sight, registered or otherwise. The only good mutant is a terminated mutant.' },
    { name: 'Free Enterprise', description: 'Find new revenue, sell new products, and do absolutely anything for the bottom line.' }
  ],
  [
    { name: 'Communists', description: "End the Computer's reign and bring fairness and equality to clones of every clearance." },
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
    { name: 'Psion', description: "Mutant powers are humanity's next step. Refine them and protect registered mutants." }
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
  ['You feel a positive emotion - happiness, serenity, excitement, or loyalty - with overwhelming intensity.', 'You feel a negative emotion - fear, sadness, paranoia, or anger - with overwhelming intensity.'],
  ['Your mind becomes clear and focused; you are immune to mind-affecting abilities.', 'Your usual hormone suppression is suddenly and completely counteracted.'],
  ['Your mutation genes are suppressed; you cannot use or be affected by mutant powers.', 'Your mutant power activates repeatedly, randomly, and entirely on its own.'],
  ['You see beautiful, complex hallucinations and know they are not real.', 'You lose all color vision; Alpha Complex becomes black, white, and gray.'],
  ['Your left elbow itches slightly. Scratching it solves the problem.', 'You collapse screaming, frothing and seizing briefly before you die.']
];

const standardInventory = [
  { id: 'laser', name: 'Laser pistol', details: '2 red barrels // 6 shots each', checked: true },
  { id: 'armor', name: 'RED reflec armor', details: 'Reflects very red lasers', checked: true },
  { id: 'pdc', name: 'Personal Digital Companion', details: 'Friend Computer is listening', checked: true },
  { id: 'credit', name: '100 credits', details: 'For official necessities', checked: true }
];

const defaultState = {
  mode: 'player',
  character: {
    name: '', nameRoot: '', clearance: 'RED', homeSector: '', clone: '1', service: '', number: 3, goal: '', society: '', societyRoll: '', power: '', powerRoll: '',
    kit: { laser: true, armor: true, pdc: true, credit: true },
    inventory: standardInventory.map(item => ({ ...item })),
    log: ''
  },
  discord: { playerWebhook: '' },
  special: {
    rdName: 'Harmony Compliance Array',
    rdDescription: 'A chrome tuning fork that makes nearby machinery hum the proper anthem. It can hear criticism.',
    rdNumber: 3,
    rdResult: '',
    rdTone: 'idle',
    drugResult: ''
  },
  session: {
    mission: { title: '', copy: '', directive: '', threat: '', twist: '', audit: '' },
    clock: 2,
    clockLabel: 'Sector compliance',
    secrets: ['', '', ''],
    incidents: ''
  }
};

const complicationSlotTables = {
  authority: [
    'Friend Computer', 'Internal Security', 'Research & Design', 'the Happiness Office',
    'Production, Logistics & Commissary', 'Armed Forces', 'the clone registrar', 'an emergency oversight committee'
  ],
  action: [
    'recover', 'escort', 'confiscate', 'repair', 'deliver', 'silence',
    'reclassify', 'contain', 'audit', 'replace', 'activate', 'deactivate'
  ],
  target: [
    'a runaway confession booth', 'the missing loyalty mascot', 'a crate of mislabelled laser barrels',
    'an apologetic warbot', 'a prototype truth detector', 'the sector dessert printer',
    'a forbidden Outdoors sample', 'a sentient requisition form', 'the emergency treason alarm',
    'a suspiciously blue scrubot', 'the mandatory fun generator', "the team's replacement clones"
  ],
  location: [
    'Transit Node 7-RED', 'the abandoned algae kitchens', 'R&D Test Chamber B',
    'the mandatory dance auditorium', 'a stalled high-speed elevator', 'the clone decanting queue',
    'an ULTRAVIOLET washroom', 'the reactor gift shop', 'Waste Reclamation Annex 3',
    'a corridor that denies existing', 'the Computer Appreciation Museum', 'the food-vat observation gantry'
  ],
  deadline: [
    'before IntSec audits the sector', 'before the next mandatory morale break', 'before the lights come back on',
    'before a rival Troubleshooter team arrives', 'before lunch service begins', 'before R&D notices it is missing',
    'before the sector celebration starts', 'before the current clone batch expires',
    'before Friend Computer asks for a progress report', 'before the assignment is officially denied'
  ],
  twist: [
    'the assignment has already been officially completed', 'the only authorized route crosses a higher-clearance zone',
    'the target recognizes one Troubleshooter as its legal owner', 'another team has received exactly opposite orders',
    'every witness communicates exclusively through dance', 'the floor reports each hurried footstep as treason',
    'R&D insists everything be returned unscratched', 'success cancels lunch and failure cancels dinner',
    'the team’s replacement clones arrived first', 'the orders contain a legally binding typo',
    'all relevant equipment was issued to the wrong citizens', 'Friend Computer requires cheerful public updates every sixty seconds'
  ]
};

const complicationTemplates = [
  ({ authority, action, target, location, deadline, twist }) =>
    `${authority} orders the team to ${action} ${target} at ${location} ${deadline}. Unfortunately, ${twist}.`,
  ({ authority, action, target, location, deadline, twist }) =>
    `Priority update from ${authority}: ${action} ${target} from ${location} ${deadline}. Be advised that ${twist}.`,
  ({ authority, action, target, location, deadline, twist }) =>
    `A routine visit to ${location} now requires the team to ${action} ${target} ${deadline}. Official reports add that ${twist}.`,
  ({ authority, action, target, location, deadline, twist }) =>
    `Responsibility for ${target} now belongs to ${authority}. The team must ${action} the target at ${location} ${deadline}, even though ${twist}.`,
  ({ authority, action, target, location, deadline, twist }) =>
    `According to ${authority}, there is no problem at ${location}. Go there, ${action} ${target}, and complete the correction ${deadline}; ${twist}.`,
  ({ authority, action, target, location, deadline, twist }) =>
    `New mandatory side objective: ${action} ${target} at ${location}. ${authority} requires completion ${deadline}, and ${twist}.`
];

const missionSlotTables = {
  action: [
    'Recover', 'Recalibrate', 'Escort', 'Silence', 'Replace', 'Protect', 'Audit', 'Deliver', 'Confiscate', 'Repair',
    'Activate', 'Deactivate', 'Reclassify', 'Sanitize', 'Infiltrate', 'Evacuate', 'Interrogate', 'Install', 'Test', 'Destroy',
    'Celebrate', 'Clone', 'Approve', 'Discredit', 'Contain'
  ],
  objective: [
    'the singing reactor core', 'a crate of experimental happiness', 'the missing loyalty mascot', 'an unlicensed weather machine', 'the sector anthem archive',
    'a prototype truth detector', 'the last clean food vat', 'an apologetic warbot', 'the Executive washroom key', 'a shipment of RED lasers',
    'the malfunctioning clone printer', 'a sentient requisition form', 'the mandatory fun generator', 'a suspiciously blue scrubot', "the Computer's birthday cake",
    'an INFRARED prophecy terminal', 'the emergency treason alarm', 'a box marked NOT MUTANTS', "the sector's oxygen permit", 'an invisible vending machine',
    'the happiness medication supply', 'a heroic documentary crew', 'the backup Friend Computer', 'a forbidden outdoors sample', 'the new corridor map'
  ],
  location: [
    'Transit Node 7-RED', 'the abandoned algae kitchens', 'PLC warehouse 404', 'the transtube interchange', 'the Junior Citizens creche',
    'the Hot Fun processing plant', 'R&D Test Chamber B', "the sector's only working toilet", 'an unlisted sub-basement', 'the Armed Forces parade deck',
    "the Happiness Officer's office", 'a crowded confession booth', 'the bot repair chapel', "the reactor's gift shop", 'the clone decanting queue',
    'an ultraviolet executive lounge', 'the mandatory dance auditorium', 'a corridor that denies existing', 'Waste Reclamation Annex 3', 'the Computer Appreciation Museum',
    'the food-vat observation gantry', 'a stalled high-speed elevator', 'the secret society lost-property desk', 'the sector border checkpoint', 'the ceiling above your current position'
  ],
  threat: [
    'communist vending machines', 'a committee of identical traitors', 'an overpromoted scrubot', 'mutant termites', 'the Armed Forces marching band',
    'a cheerful reactor leak', 'an IntSec officer with a theory', 'a rival Troubleshooter team', 'weaponized paperwork', 'a swarm of loyalty drones',
    'a homicidal service elevator', 'citizens enjoying themselves incorrectly', 'a deeply offended food vat', 'a secret society bake sale', 'an R&D prototype seeking tenure',
    'a clone who remembers tomorrow', 'the lights becoming self-aware', 'an unauthorized breeze', 'a corridor-wide identity audit', 'a very persuasive infrared citizen',
    'a tactical morale parade', 'a laser-resistant apology', 'a contagious sense of perspective', "the Computer's least favorite algorithm", 'your own malfunction report'
  ],
  complication: [
    'the floor reports every footstep as treason', 'all doors now demand compliments', 'your equipment recognizes the wrong owner', 'the mission was already declared a success', 'one teammate appears on the target list',
    'the lights go out whenever anyone tells the truth', 'the deadline expired yesterday', 'the only witness communicates through dance', 'the area is above your clearance', 'R&D wants the danger returned unscratched',
    'everyone has been issued contradictory orders', 'the map redraws itself when observed', 'the target insists it is Friend Computer', 'failure will cancel lunch', 'success will also cancel lunch',
    'a live documentary crew is rating your loyalty', 'every laser has been set to encouraging', 'the local bots have formed a jury', 'your replacement clones arrived first', 'the evidence keeps apologizing and escaping',
    'the air is now a controlled substance', 'someone has weaponized the hold music', 'the Computer is personally monitoring your teamwork', 'there is a second, louder mission underneath this one', 'the orders contain a legally binding typo'
  ]
};

const missionTemplates = [
  ({ action, objective, location, threat, complication }) => ({
    title: `${objective} has changed hands.`,
    copy: `At ${location}, ${threat} now controls ${objective}. Your team will ${action.toLowerCase()} it before anyone notices that ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `A routine delivery has become exciting.`,
    copy: `${objective} must reach ${location}, where ${threat} is waiting. ${action} the assignment with exemplary calm; reports indicate that ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `Friend Computer requires a correction.`,
    copy: `${location} has officially never contained ${objective}. Unfortunately, ${threat} has photographic evidence. ${action} the discrepancy while ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `The celebration must proceed.`,
    copy: `A mandatory ceremony at ${location} needs ${objective}, but ${threat} has disrupted the schedule. ${action} the centerpiece despite the fact that ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `Property is behaving disloyally.`,
    copy: `${objective} escaped into ${location} and may be cooperating with ${threat}. ${action} Computer property intact, unless ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `An inspection is already in progress.`,
    copy: `Before inspectors reach ${location}, ${action.toLowerCase()} ${objective} and remove all traces of ${threat}. Work efficiently: ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `A loyal citizen has made an allegation.`,
    copy: `${threat} has been blamed for an incident involving ${objective} at ${location}. ${action} the evidence, remembering that ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `The emergency is completely under control.`,
    copy: `${location} is sealed around ${objective}. Inside are ${threat}. ${action} the situation without contradicting the official position that ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `Another team has failed successfully.`,
    copy: `Recover their work at ${location}: ${objective}, several scorch marks, and ${threat}. Your revised order is to ${action.toLowerCase()} it, although ${complication}.`
  }),
  ({ action, objective, location, threat, complication }) => ({
    title: `Today's problem is tomorrow's mandatory feature.`,
    copy: `R&D will demonstrate ${objective} at ${location} in front of ${threat}. ${action} the prototype before the demonstration reveals that ${complication}.`
  })
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
function cleanInventory(items) {
  return items.slice(0, 40).map((item, index) => ({
    id: String(item?.id || `item-${index}`).replace(/[^a-z0-9_-]/gi, '').slice(0, 48) || `item-${index}`,
    name: String(item?.name || 'UNNAMED ITEM').slice(0, 60),
    details: String(item?.details || '').slice(0, 100),
    checked: Boolean(item?.checked)
  })).filter((item, index, all) => all.findIndex(candidate => candidate.id === item.id) === index);
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return clone(defaultState);
    const characterDefaults = clone(defaultState).character;
    const storedCharacter = stored.character || {};
    const legacyKit = { ...characterDefaults.kit, ...(storedCharacter.kit || {}) };
    const inventory = Array.isArray(storedCharacter.inventory)
      ? cleanInventory(storedCharacter.inventory)
      : standardInventory.map(item => ({ ...item, checked: Boolean(legacyKit[item.id]) }));
    const loaded = {
      ...clone(defaultState), ...stored,
      character: { ...characterDefaults, ...storedCharacter, kit: legacyKit, inventory },
      discord: { playerWebhook: String(stored.discord?.playerWebhook || '') },
      special: { ...clone(defaultState).special, ...(stored.special || {}) },
      session: {
        ...clone(defaultState).session,
        clock: Number.isFinite(Number(stored.session?.clock)) ? Math.max(0, Math.min(6, Math.round(Number(stored.session.clock)))) : defaultState.session.clock,
        clockLabel: String(stored.session?.clockLabel || defaultState.session.clockLabel).slice(0, 38),
        secrets: Array.isArray(stored.session?.secrets) ? stored.session.secrets.slice(0, 3) : clone(defaultState).session.secrets,
        incidents: String(stored.session?.incidents || '').slice(0, 1400),
        mission: { ...clone(defaultState).session.mission, ...(stored.session?.mission || {}) }
      }
    };
    migrateCharacter(loaded.character);
    return loaded;
  } catch { return clone(defaultState); }
}

let state = loadState();
let rollType = 'lasers';
let gameRollMode = 'action';
let baseDice = 1;
let bonusSkill = false;
let bonusStyle = false;
let activeSecret = 0;
let creationStep = 1;
let toastTimer;
let appBooted = false;
let asciiObserver;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function setAsciiState(button, selected) {
  const marker = $('.ascii-state', button);
  if (marker) marker.textContent = selected ? '[X]' : '[ ]';
}

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
  standardInventory.forEach(item => {
    character.kit[item.id] = Boolean(character.inventory.find(entry => entry.id === item.id)?.checked);
  });
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
    setAsciiState(button, selected);
  });
  $('#number-output').textContent = `[${c.number}]`;
  $('#roll-number-reference').textContent = c.number;
  renderInventory();
  updateRestrictedFactorForms();
}

function renderInventory() {
  const list = $('#inventory-list');
  if (!state.character.inventory.length) {
    list.innerHTML = '<p class="inventory-empty">[EMPTY] Friend Computer has noted your lack of equipment.</p>';
    return;
  }
  list.innerHTML = state.character.inventory.map(item => {
    const id = escapeHTML(item.id);
    return `<div class="inventory-item">
      <label class="inventory-toggle"><input type="checkbox" data-inventory-check="${id}" ${item.checked ? 'checked' : ''} /><span class="custom-check">${item.checked ? '[X]' : '[ ]'}</span><span class="sr-only">Packed</span></label>
      <div class="inventory-fields">
        <label><span class="sr-only">Item name</span><input data-inventory-name="${id}" maxlength="60" value="${escapeHTML(item.name)}" aria-label="Item name" /></label>
        <label><span class="sr-only">Item notes</span><input class="inventory-detail" data-inventory-details="${id}" maxlength="100" value="${escapeHTML(item.details)}" placeholder="NO NOTES" aria-label="Item notes" /></label>
      </div>
      <button type="button" class="inventory-remove" data-inventory-remove="${id}" aria-label="Remove ${escapeHTML(item.name)}">[-]</button>
    </div>`;
  }).join('');
}

function inventoryItem(id) {
  return state.character.inventory.find(item => item.id === id);
}

function syncStandardKit(id, checked) {
  if (standardInventory.some(item => item.id === id)) state.character.kit[id] = checked;
}

function updateCreatorForm() {
  const c = state.character;
  $('#creator-clearance').value = c.clearance;
  $('#creator-service').value = c.service;
  $('#creator-name-root').value = c.nameRoot;
  $('#creator-home-sector').value = c.homeSector;
  $('#creator-clone-count').value = c.clone;
  $('#creator-goal').value = c.goal;
  $('#creator-number-output').textContent = `[${c.number}]`;
  $('#creator-designation').textContent = characterDesignation(c);
  $$('.creator-number-option').forEach(button => {
    const selected = Number(button.dataset.number) === c.number;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-checked', String(selected));
    button.tabIndex = selected ? 0 : -1;
    setAsciiState(button, selected);
  });
  $$('[data-creator-kit]').forEach(input => {
    input.checked = Boolean(c.kit[input.dataset.creatorKit]);
    input.nextElementSibling.textContent = input.checked ? '[X]' : '[ ]';
  });
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

function setHookStatus(message, tone = 'idle') {
  $('#player-hook-status').textContent = message;
  const light = $('#player-hook-light');
  light.className = `relay-light is-${tone}`;
  light.textContent = `STATUS> ${tone === 'armed' ? 'ARMED' : tone === 'sending' ? 'SENDING' : tone === 'error' ? 'SIGNAL ERROR' : 'LOCAL'}`;
}

function refreshHookStatus() {
  const check = discordWebhookValidation(state.discord.playerWebhook);
  if (check.empty) {
    setHookStatus('Paste a hook and this browser will announce your rolls.');
  } else if (check.valid) {
    setHookStatus('Roll relay armed on this browser. The URL remains local.', 'armed');
  } else {
    setHookStatus('That does not look like a Discord webhook URL.', 'error');
  }
}

function updateDiscordForm() {
  $('#player-webhook').value = state.discord.playerWebhook;
  refreshHookStatus();
}

function saveWebhook(value) {
  state.discord.playerWebhook = String(value || '').trim();
  save();
  refreshHookStatus();
}

function forgetWebhook() {
  state.discord.playerWebhook = '';
  save();
  $('#player-webhook').value = '';
  refreshHookStatus();
  showToast('Webhook forgotten on this device. Friend Computer respects your discretion.');
}

function updateGMTools() {
  const s = state.session;
  const mission = s.mission;
  $('#mission-output-title').textContent = mission.title || 'NO MISSION GENERATED';
  $('#mission-output-copy').textContent = mission.copy || 'Run MISSION.EXE to roll one format and five d25 tables.';
  $('#mission-output-directive').textContent = mission.directive || '---';
  $('#mission-output-threat').textContent = mission.threat || '---';
  $('#mission-output-twist').textContent = mission.twist || '---';
  $('#mission-roll-readout').textContent = mission.audit || 'STATUS> READY // 10 FORMATS x 5 D25 TABLES';
  $('#copy-mission-output').disabled = !mission.title;
  $('#gm-clock-label').value = s.clockLabel;
  const meter = $('#clock-meter');
  meter.textContent = `CLOCK> [${'#'.repeat(s.clock)}${'.'.repeat(6 - s.clock)}] ${s.clock}/6`;
  meter.setAttribute('aria-label', `${s.clockLabel} ${s.clock} of 6`);
  meter.setAttribute('aria-valuenow', String(s.clock));
  $('#clock-outcome').textContent = clockOutcome(s.clock);
  $('#incident-log').value = s.incidents;
  $('#incident-count').textContent = `${s.incidents.length} / 1400`;
  $('#secret-note').value = s.secrets[activeSecret] || '';
  $('#secret-note-label').textContent = ['TWIST.DAT', 'NPC.DAT', 'EVIDENCE.DAT'][activeSecret];
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
    setAsciiState(button, active);
  });
  $('#skill-bonus').classList.toggle('active', bonusSkill);
  $('#style-bonus').classList.toggle('active', bonusStyle);
  $('#skill-bonus').setAttribute('aria-pressed', String(bonusSkill));
  $('#style-bonus').setAttribute('aria-pressed', String(bonusStyle));
  $('#skill-bonus span').textContent = bonusSkill ? '[X]' : '[ ]';
  $('#style-bonus span').textContent = bonusStyle ? '[X]' : '[ ]';
  return total;
}

function setGameRollMode(mode) {
  gameRollMode = ['action', 'rd', 'drugs'].includes(mode) ? mode : 'action';
  $$('.game-roll-tab').forEach(button => {
    const active = button.dataset.gameRoll === gameRollMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    setAsciiState(button, active);
  });
  $$('[data-game-roll-panel]').forEach(panel => {
    const active = panel.dataset.gameRollPanel === gameRollMode;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  $('#roll-number-reference').hidden = gameRollMode !== 'action';
}

function renderAll() {
  updateCharacterForm();
  updateCreatorForm();
  updateGMTools();
  updateDiscordForm();
  updateRollControls();
  updateSpecialRolls();
  setGameRollMode(gameRollMode);
}

function setMode(mode, shouldScroll = false) {
  mode = mode === 'gm' ? 'gm' : 'player';
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
    setAsciiState(button, active);
  });
  if (appBooted) startAsciiTyping(player ? $('#player-view') : $('#gm-view'));
  if (shouldScroll) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

function startAsciiTyping(view) {
  asciiObserver?.disconnect();
  const directory = $('.ascii-directory', view);
  const rails = $$('.ascii-tool-frame, .ascii-tool-end', view);
  [directory, ...rails].filter(Boolean).forEach(target => {
    target.classList.remove('ascii-type-target', 'ascii-awaiting');
    target.style.removeProperty('--type-delay');
  });
  if (prefersReducedMotion()) return;
  if (directory) {
    void directory.offsetWidth;
    directory.classList.add('ascii-type-target');
  }
  rails.forEach(target => target.classList.add('ascii-awaiting'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      target.style.setProperty('--type-delay', target.classList.contains('ascii-tool-end') ? '110ms' : '0ms');
      target.classList.remove('ascii-awaiting');
      target.classList.add('ascii-type-target');
      observer.unobserve(target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  asciiObserver = observer;
  rails.forEach(target => observer.observe(target));
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
  $('#rd-name').textContent = special.rdName;
  $('#rd-description').textContent = special.rdDescription;
  $('#rd-safe-useful-number').value = String(special.rdNumber);
  $('#rd-number').textContent = special.rdNumber;
  const rdText = special.rdResult || 'Awaiting a one-die field test. No bonuses and no assistance.';
  ['rd-special-result', 'gm-rd-roll-result'].forEach(id => {
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

function updateSessionField(key, event) {
  state.session[key] = event.target.value;
  save();
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
  const diceMarkup = dice.map(die => {
    const exactDie = die === number;
    const successfulDie = isSuccess(die);
    const marker = exactDie ? '!' : successfulDie ? '+' : '-';
    const label = exactDie ? 'exact complication' : successfulDie ? 'success' : 'miss';
    return `<span class="die ${exactDie ? 'exact' : successfulDie ? 'success' : ''}" aria-label="${die}, ${label}">[${die}${marker}]</span>`;
  }).join('');
  $('#roll-result').className = 'roll-result has-result';
  $('#roll-result').innerHTML = `
    <div class="result-summary"><b>RESULT&gt; ${successes} ${successes === 1 ? 'SUCCESS' : 'SUCCESSES'}</b><span>${escapeHTML(outcome)}</span></div>
    <div class="die-row" aria-label="Rolled dice">${diceMarkup}</div>
    <p class="result-note">KEY&gt; [+] SUCCESS // [!] EXACT // [-] MISS</p>
    <p class="result-note">${exact ? `<b>TREASONOUS LASER.</b> ${escapeHTML(complication)}` : 'No exact hits. Friend Computer approves this statistically ordinary behavior.'}</p>
    <p class="result-flavor"><span>COMMENT&gt;</span>${escapeHTML(flavor)}</p>`;
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
      fields: fields.map(field => ({ name: String(field.name).slice(0, 256), value: String(field.value || '---').slice(0, 1024), inline: Boolean(field.inline) })),
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
      { name: 'RESULT', value: `${report.successes} ${report.successes === 1 ? 'success' : 'successes'} // ${report.outcome}`, inline: true },
      { name: report.exact ? 'TREASONOUS LASER' : 'COMPUTER ASSESSMENT', value: report.exact ? report.complication : 'No abnormality detected. Carry on, citizen.' }
    ]
  );
}

async function postDiscordWebhook(payload) {
  const check = discordWebhookValidation(state.discord.playerWebhook);
  if (!check.valid) throw new Error(check.empty ? 'No webhook pasted.' : 'Invalid Discord webhook URL.');
  const response = await fetch(check.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Discord returned ${response.status}.`);
}

async function testDiscordWebhook() {
  const check = discordWebhookValidation(state.discord.playerWebhook);
  if (!check.valid) {
    refreshHookStatus();
    showToast(check.empty ? 'Paste a Discord webhook first.' : 'That webhook URL is not valid.');
    return;
  }
  setHookStatus('Opening a secure-ish channel to Friend Computer...', 'sending');
  try {
    await postDiscordWebhook(discordEmbed('RELAY TEST // CONNECTION ACCEPTED', 'This webhook has been configured by a loyal citizen. Friend Computer appreciates the initiative.', 0x4bd66a));
    setHookStatus('Signal received. Friend Computer is listening.', 'armed');
    showToast('Discord relay test delivered.');
  } catch (error) {
    setHookStatus(`${error.message} Check the webhook and try again.`, 'error');
    showToast('Discord could not receive the test.');
  }
}

async function announcePlayerRoll(report) {
  if (!discordWebhookValidation(state.discord.playerWebhook).valid) return;
  setHookStatus('Filing your roll with Friend Computer...', 'sending');
  try {
    await postDiscordWebhook(rollDiscordPayload(report));
    setHookStatus('Roll delivered. Friend Computer has noticed.', 'armed');
  } catch (error) {
    setHookStatus(`${error.message} Your roll still exists locally.`, 'error');
    showToast('Roll recorded here; Discord delivery failed.');
  }
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
    showToast(copied ? successMessage : 'Copy failed. Select the output manually.');
  }
}

function copyMissionOutput() {
  const mission = state.session.mission;
  if (!mission.title) return;
  const text = `MISSION.EXE // GENERATED OUTPUT\n\n${mission.title}\n${mission.copy}\n\nACTION> ${mission.directive}\nTHREAT> ${mission.threat}\nTWIST> ${mission.twist}\n\n${mission.audit}`;
  return copyText(text, 'Mission generator output copied.');
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
  $('#creator-progress-bar').textContent = `[${'#'.repeat(creationStep)}${'.'.repeat(creationSteps.length - creationStep)}]`;
  $('#creator-back').disabled = creationStep === 1;
  $('#creator-next').textContent = creationStep === creationSteps.length ? '[COMPLETE RECORD]' : `[NEXT> ${current.next.toUpperCase()}]`;
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
    acknowledge.textContent = '[ENTER] BEGIN';
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
      appBooted = true;
      startAsciiTyping(state.mode === 'gm' ? $('#gm-view') : $('#player-view'));
      $('.mode-button.active').focus();
    }, prefersReducedMotion() ? 0 : 260);
  };
  if (prefersReducedMotion()) {
    lines.forEach(line => line.classList.add('is-visible'));
    prepare();
  } else {
    prepare();
    lines.forEach((line, index) => timers.push(window.setTimeout(() => line.classList.add('is-visible'), 180 + index * 245)));
  }
  acknowledge.addEventListener('click', finish);
  window.addEventListener('keydown', event => {
    if (ready && !finished && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      finish();
    }
  });
}

function generateSpark() {
  const slots = {};
  Object.entries(complicationSlotTables).forEach(([slot, table]) => { slots[slot] = choose(table); });
  $('#spark-display p').textContent = choose(complicationTemplates)(slots);
}
function rollMission() {
  const templateRoll = Math.floor(Math.random() * missionTemplates.length);
  const slotRolls = {};
  const slots = {};
  Object.entries(missionSlotTables).forEach(([slot, table]) => {
    const roll = Math.floor(Math.random() * table.length);
    slotRolls[slot] = roll + 1;
    slots[slot] = table[roll];
  });
  const result = missionTemplates[templateRoll](slots);
  const capitalize = value => value.charAt(0).toUpperCase() + value.slice(1);
  state.session.mission = {
    title: capitalize(result.title).slice(0, 76),
    copy: result.copy.slice(0, 420),
    directive: `${slots.action} ${slots.objective}`.slice(0, 80),
    threat: capitalize(slots.threat).slice(0, 80),
    twist: capitalize(slots.complication).slice(0, 120),
    audit: `FORMAT=${String(templateRoll + 1).padStart(2, '0')} // ACTION=${String(slotRolls.action).padStart(2, '0')} // OBJECT=${String(slotRolls.objective).padStart(2, '0')} // LOCATION=${String(slotRolls.location).padStart(2, '0')} // THREAT=${String(slotRolls.threat).padStart(2, '0')} // TWIST=${String(slotRolls.complication).padStart(2, '0')}`
  };
  save();
  updateGMTools();
  showToast('MISSION.EXE returned one operational disaster.');
}

function generateRD() {
  const name = `${choose(rdWords.first)} ${choose(rdWords.second)} ${choose(rdWords.third)}`;
  const description = choose(rdWords.use);
  const number = Math.floor(Math.random() * 4) + 2;
  state.special.rdName = name;
  state.special.rdDescription = description;
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
  $('#inventory-list').addEventListener('change', event => {
    const checkbox = event.target.closest('[data-inventory-check]');
    if (!checkbox) return;
    const item = inventoryItem(checkbox.dataset.inventoryCheck);
    if (!item) return;
    item.checked = checkbox.checked;
    checkbox.nextElementSibling.textContent = item.checked ? '[X]' : '[ ]';
    syncStandardKit(item.id, item.checked);
    save();
    updateCreatorForm();
  });
  $('#inventory-list').addEventListener('input', event => {
    const nameInput = event.target.closest('[data-inventory-name]');
    const detailInput = event.target.closest('[data-inventory-details]');
    const input = nameInput || detailInput;
    if (!input) return;
    const item = inventoryItem(nameInput?.dataset.inventoryName || detailInput.dataset.inventoryDetails);
    if (!item) return;
    item[nameInput ? 'name' : 'details'] = input.value;
    save();
  });
  $('#inventory-list').addEventListener('click', event => {
    const button = event.target.closest('[data-inventory-remove]');
    if (!button) return;
    const id = button.dataset.inventoryRemove;
    state.character.inventory = state.character.inventory.filter(item => item.id !== id);
    syncStandardKit(id, false);
    save();
    updateCharacterForm();
    updateCreatorForm();
    showToast('Inventory item removed. Loss report pre-approved.');
  });
  $('#inventory-add-form').addEventListener('submit', event => {
    event.preventDefault();
    const nameInput = $('#inventory-new-name');
    const detailsInput = $('#inventory-new-details');
    const name = nameInput.value.trim();
    if (!name) return nameInput.focus();
    if (state.character.inventory.length >= 40) {
      showToast('Inventory limit reached. File a requisition for more pockets.');
      return nameInput.focus();
    }
    state.character.inventory.push({
      id: `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.slice(0, 60),
      details: detailsInput.value.trim().slice(0, 100),
      checked: true
    });
    save();
    renderInventory();
    event.target.reset();
    nameInput.focus();
    showToast('Inventory item registered. Ownership remains a privilege.');
  });

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
    const id = event.target.dataset.creatorKit;
    state.character.kit[id] = event.target.checked;
    const existing = inventoryItem(id);
    if (existing) existing.checked = event.target.checked;
    else if (event.target.checked) state.character.inventory.push({ ...standardInventory.find(item => item.id === id), checked: true });
    event.target.nextElementSibling.textContent = event.target.checked ? '[X]' : '[ ]';
    save();
    renderInventory();
  }));
  $('#creator-back').addEventListener('click', () => showCreatorStep(creationStep - 1));
  $('#creator-next').addEventListener('click', advanceCreator);
  $('#close-creator').addEventListener('click', closeCreator);
  $('#creation-dialog').addEventListener('click', event => { if (event.target === $('#creation-dialog')) closeCreator(); });

  $$('.roll-type').forEach(button => button.addEventListener('click', () => { rollType = button.dataset.rollType; updateRollControls(); }));
  bindRadioKeyboard('.roll-type', button => { rollType = button.dataset.rollType; updateRollControls(); });
  $$('.game-roll-tab').forEach(button => button.addEventListener('click', () => setGameRollMode(button.dataset.gameRoll)));
  bindRadioKeyboard('.game-roll-tab', button => setGameRollMode(button.dataset.gameRoll));
  $('#add-die').addEventListener('click', () => { baseDice = Math.min(8, baseDice + 1); updateRollControls(); });
  $('#remove-die').addEventListener('click', () => { baseDice = Math.max(1, baseDice - 1); updateRollControls(); });
  $('#skill-bonus').addEventListener('click', () => { bonusSkill = !bonusSkill; updateRollControls(); });
  $('#style-bonus').addEventListener('click', () => { bonusStyle = !bonusStyle; updateRollControls(); });
  $('#roll-button').addEventListener('click', rollDice);
  $('#rd-safe-useful-number').addEventListener('change', event => setRDNumber(event.target.value));
  $('#roll-rd-item').addEventListener('click', rollRDItem);
  $('#roll-drug-interaction').addEventListener('click', mixDrugs);
  $('#player-webhook').addEventListener('input', event => saveWebhook(event.target.value));
  $('#test-player-webhook').addEventListener('click', testDiscordWebhook);
  $('#clear-player-webhook').addEventListener('click', forgetWebhook);

  $('#roll-mission').addEventListener('click', rollMission);
  $('#copy-mission-output').addEventListener('click', copyMissionOutput);
  $('#gm-clock-label').addEventListener('input', event => {
    updateSessionField('clockLabel', event);
    $('#clock-meter').setAttribute('aria-label', `${state.session.clockLabel || 'Clock'} ${state.session.clock} of 6`);
  });
  $('#clock-up').addEventListener('click', () => { state.session.clock = Math.min(6, state.session.clock + 1); save(); renderAll(); });
  $('#clock-down').addEventListener('click', () => { state.session.clock = Math.max(0, state.session.clock - 1); save(); renderAll(); });
  $('#reset-clock').addEventListener('click', () => { state.session.clock = 0; save(); renderAll(); showToast('Compliance clock reset. Suspiciously forgiving.'); });

  $('#generate-spark').addEventListener('click', generateSpark);
  $('#copy-spark').addEventListener('click', () => copyText($('#spark-display p').textContent, 'Complication copied.'));
  $('#add-spark-log').addEventListener('click', () => {
    const line = `[COMPLICATION] ${$('#spark-display p').textContent}`;
    state.session.incidents = state.session.incidents ? `${state.session.incidents}\n${line}` : line;
    save(); updateGMTools(); showToast('Added to the incident log.');
  });
  $('#generate-rd').addEventListener('click', generateRD);
  $('#roll-rd-gm').addEventListener('click', rollRDItem);
  $$('.secret-tab').forEach(button => button.addEventListener('click', () => {
    activeSecret = Number(button.dataset.secret);
    $$('.secret-tab').forEach(tab => {
      const selected = Number(tab.dataset.secret) === activeSecret;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', String(selected));
      setAsciiState(tab, selected);
    });
    updateGMTools();
  }));
  $('#secret-note').addEventListener('input', event => { state.session.secrets[activeSecret] = event.target.value; save(); });
  $('#incident-log').addEventListener('input', event => { state.session.incidents = event.target.value; save(); $('#incident-count').textContent = `${event.target.value.length} / 1400`; });
  $('#clear-incidents').addEventListener('click', () => { if (!state.session.incidents) return; state.session.incidents = ''; save(); updateGMTools(); showToast('Incident log cleared. An unusual lack of accountability.'); });

  window.addEventListener('keydown', event => {
    if (event.key === 'F1') { event.preventDefault(); setMode('player', true); }
    if (event.key === 'F2') { event.preventDefault(); setMode('gm', true); }
  });
}

renderAll();
bindEvents();
setMode(state.mode);
bootApplication();
