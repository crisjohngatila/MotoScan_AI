/* PART INFORMATION - edit the text here. Keys should match the model's class names (case, spaces and underscores are ignored). Classes without an entry still show their name, just no guide.
   General guidance only: no part numbers, prices, specs or exact compatibility. */
const NO_COMPAT = "No verified compatibility data in this app yet. Check your owner's manual or a dealer.";
const PARTS_DATA = {
  "Spark Plug": {
    summary: "Small component that ignites the fuel-air mixture in the engine.",
    description: "A spark plug has a metal shell, a ceramic insulator and electrodes at the tip. It creates a spark inside the combustion chamber.",
    function: "Ignites the compressed fuel-air mixture at the right moment so the engine can run.",
    importance: "Weak or mistimed sparks can cause hard starting, rough running, poor fuel economy and power loss.",
    wear: ["Hard starting or misfiring", "Rough idle or hesitation", "Heavy deposits or a worn tip (visual hints only)"],
    maintenance: "Check at the interval in your owner's manual, on a cool engine, and tighten as the manual describes.",
    buying: "Match plug type and heat range to your owner's manual.",
    compatibility: NO_COMPAT,
    safety: "Work only on a cool engine."
  },
  "Brake Pad": {
    summary: "Friction material that presses on the disc to slow the motorcycle.",
    description: "A brake pad is a metal backing plate with friction material, fitted in the caliper on either side of the brake disc.",
    function: "Creates friction against the brake disc to slow or stop the wheel.",
    importance: "Braking is safety-critical. Worn pads reduce stopping power and can damage the disc.",
    wear: ["Squealing or grinding when braking", "Longer stopping distance or a spongy lever", "Very thin friction material (visual hint only)"],
    maintenance: "Inspect pad thickness regularly against the minimum in your manual. Keep pads and discs free of oil.",
    buying: "Use pads made for your exact model and year.",
    compatibility: NO_COMPAT,
    safety: "Have brake work done or checked by a qualified mechanic. Never ride with doubtful brakes."
  },
  "Chain": {
    summary: "Metal chain that carries engine power to the rear wheel.",
    description: "A drive chain is a series of linked rollers and plates running between the front and rear sprockets.",
    function: "Transfers power from the engine to the rear wheel.",
    importance: "A neglected chain wears quickly, wears the sprockets and can fail suddenly.",
    wear: ["Stiff or rusty links", "Too much slack or uneven tension", "Noise or jerky power delivery (visual hints only)"],
    maintenance: "Clean and lubricate regularly and check tension as your manual specifies.",
    buying: "Check chain size, length and type in your manual. Chains and sprockets are usually replaced together.",
    compatibility: NO_COMPAT,
    safety: "A broken chain can lock the rear wheel or cause injury. Replace worn chains promptly."
  },
  "Sprocket": {
    summary: "Toothed wheel that engages the chain.",
    description: "Sprockets are toothed wheels: a small one on the engine output shaft and a larger one on the rear wheel.",
    function: "Engages the chain so engine power turns the rear wheel.",
    importance: "Worn sprockets speed up chain wear and reduce power transfer.",
    wear: ["Hooked, pointed or uneven teeth", "Missing or cracked teeth", "Chain noise or slipping (visual hints only)"],
    maintenance: "Inspect whenever you check the chain; replace with the chain if worn.",
    buying: "Tooth count and mounting must match your motorcycle.",
    compatibility: NO_COMPAT,
    safety: "Keep hands and clothing clear of the chain and sprockets."
  },
  "Oil Filter": {
    summary: "Removes particles from the engine oil.",
    description: "An oil filter is a canister or cartridge that traps dirt and metal particles as oil circulates.",
    function: "Keeps engine oil clean so moving parts are protected.",
    importance: "A clogged or poor filter can reduce oil flow and speed up engine wear.",
    wear: ["Overdue service interval", "Oil leaks around the filter", "Dented or damaged housing (visual hints only)"],
    maintenance: "Replace at the interval in your manual, normally with each oil change, and check for leaks afterwards.",
    buying: "Match the filter to your engine. Both cartridge and spin-on types exist.",
    compatibility: NO_COMPAT,
    safety: "Hot oil can burn. Dispose of used oil and filters properly."
  },
  "Air Filter": {
    summary: "Cleans the air entering the engine.",
    description: "An air filter is a foam, paper or fabric element in the airbox that stops dust and debris reaching the engine.",
    function: "Supplies clean air for combustion.",
    importance: "A dirty filter restricts airflow and wastes fuel. A damaged one lets dirt into the engine.",
    wear: ["Visible dirt, oil saturation or tears", "Loss of power or poor fuel economy", "Hard starting (visual hints only)"],
    maintenance: "Inspect often, especially in dusty conditions. Clean or replace according to the filter type and your manual.",
    buying: "Pick the filter for your model and note whether it is foam, paper or reusable.",
    compatibility: NO_COMPAT,
    safety: "Never run the engine without the filter fitted."
  },
  "Air Fin": {
    "summary": "Cooling ridges on an air-cooled engine that shed heat.",
    "description": "Air fins are thin ridges cast into the cylinder and cylinder head. They add surface area so passing air can carry heat away.",
    "function": "Helps cool the engine by passing heat to the surrounding air.",
    "importance": "Poor cooling can cause power loss, hard running and engine damage.",
    "wear": [
      "Bent, broken or missing fins",
      "Mud, oil or debris packed between the fins",
      "Engine running hotter than usual (visual hints only)"
    ],
    "maintenance": "Keep the fins clean and clear of debris. Wash gently on a cool engine and never bend them.",
    "buying": "Fins are normally part of the cylinder or head, so they are rarely sold on their own. Check your owner's manual.",
    "compatibility": NO_COMPAT,
    "safety": "Fins get very hot while running and can have sharp edges. Work only on a cool engine."
  },
  "Alternator": {
    "summary": "Generates electricity while the engine runs.",
    "description": "An alternator is a small generator driven by the engine. It uses a rotor and stator coils to make electricity.",
    "function": "Charges the battery and powers the lights, ignition and electronics.",
    "importance": "A weak alternator drains the battery and can leave you stranded.",
    "wear": [
      "Dim or flickering lights",
      "Battery that keeps going flat",
      "Charging warning light (visual hints only)"
    ],
    "maintenance": "Have the charging output tested at service time and keep connectors clean and dry.",
    "buying": "Parts such as the stator and regulator may be sold separately, so confirm which part is faulty first.",
    "compatibility": NO_COMPAT,
    "safety": "Disconnect the battery before electrical work and keep clear of moving parts."
  },
  "Battery Terminal": {
    "summary": "Metal connectors where cables attach to the battery.",
    "description": "Battery terminals are the posts and clamps that join the battery to the motorcycle's wiring, one positive and one negative.",
    "function": "Carry electrical current between the battery and the rest of the bike.",
    "importance": "Loose or corroded terminals cause weak starting, flickering electrics and heat at the connection.",
    "wear": [
      "White or green crusty buildup",
      "Loose clamps",
      "Hard starting (visual hints only)"
    ],
    "maintenance": "Keep terminals clean, tight and dry, and follow your manual for protecting them.",
    "buying": "Match the terminal type and size to your battery.",
    "compatibility": NO_COMPAT,
    "safety": "Disconnect the negative first and reconnect it last. Never let a tool bridge both terminals. Battery acid is corrosive, so protect your eyes and skin."
  },
  "Brake Clutch Cable": {
    "summary": "Steel cable that carries lever movement to the brake or clutch.",
    "description": "A control cable is an inner steel wire inside an outer sheath, linking a handlebar lever to the part it operates.",
    "function": "Passes your lever pull to the brake or clutch mechanism.",
    "importance": "A stiff, frayed or stretched cable hurts control, and a snapped one can cause sudden loss of the brake or clutch.",
    "wear": [
      "Stiff or sticky lever feel",
      "Frayed strands or kinks",
      "Too much lever travel (visual hints only)"
    ],
    "maintenance": "Lubricate and adjust free play as your manual describes, and check the routing is smooth.",
    "buying": "Cable length and end fittings must match your model. Brake and clutch cables are different.",
    "compatibility": NO_COMPAT,
    "safety": "Replace a frayed cable straight away. Have brake cable work checked by a qualified mechanic."
  },
  "Brake Clutch Lever": {
    "summary": "Hand lever that operates the brake or clutch.",
    "description": "A control lever pivots on the handlebar. Commonly one side works the front brake and the other the clutch.",
    "function": "Turns your hand pull into brake or clutch action.",
    "importance": "A bent, cracked or loose lever reduces control when you need it most.",
    "wear": [
      "Cracks or bends",
      "Loose or sloppy pivot",
      "Rough or sticky movement (visual hints only)"
    ],
    "maintenance": "Check the pivot and mounting bolt, lubricate the pivot as your manual describes and keep the lever position comfortable.",
    "buying": "Left, right, brake and clutch levers differ, so match your model.",
    "compatibility": NO_COMPAT,
    "safety": "Do not ride with a cracked or broken brake lever. Have it replaced and checked."
  },
  "Brake Light Switch": {
    "summary": "Switch that turns on the brake light when you brake.",
    "description": "A brake light switch sits at the brake lever or pedal, or on the brake line, and closes a circuit when the brake is applied.",
    "function": "Lights the brake light so riders behind can see you slowing.",
    "importance": "A brake light that does not work is unsafe and often illegal.",
    "wear": [
      "Brake light never comes on or stays on",
      "Flickering light",
      "Needing a very hard press before it lights (visual hints only)"
    ],
    "maintenance": "Check the brake light works every ride and keep connectors clean and dry. Adjust as your manual describes.",
    "buying": "Front and rear switches can differ, so match your model.",
    "compatibility": NO_COMPAT,
    "safety": "Test the light before riding. Disconnect the battery before electrical work."
  },
  "Brake Oil Reservoir": {
    "summary": "Holds the brake fluid for hydraulic brakes.",
    "description": "The reservoir is a small container with a cap and a level window or marks, feeding the brake master cylinder.",
    "function": "Supplies brake fluid to the hydraulic brake system.",
    "importance": "Low, old or contaminated fluid reduces braking performance.",
    "wear": [
      "Level below the minimum mark",
      "Dark or dirty fluid",
      "Cracks or leaks (visual hints only)"
    ],
    "maintenance": "Check the level with the bike upright, keep the cap clean and change fluid as your manual describes.",
    "buying": "Use only the fluid type your manual specifies and never mix types.",
    "compatibility": NO_COMPAT,
    "safety": "Brake fluid damages paint and irritates skin and eyes. A falling level can mean worn pads or a leak, so have the brakes checked by a qualified mechanic."
  },
  "Brake Pedal": {
    "summary": "Foot lever that operates the rear brake.",
    "description": "The brake pedal pivots on the frame and links to the rear brake through a master cylinder or a rod.",
    "function": "Lets you apply the rear brake with your foot.",
    "importance": "A bent, loose or sticking pedal affects rear braking control.",
    "wear": [
      "Bent or loose pedal",
      "Slow or sticky return",
      "Too much travel or a soft feel (visual hints only)"
    ],
    "maintenance": "Lubricate the pivot, check the return spring and set pedal height and free play as your manual describes.",
    "buying": "Match the pedal to your model and year.",
    "compatibility": NO_COMPAT,
    "safety": "Have rear brake problems checked by a qualified mechanic before riding."
  },
  "Camshaft": {
    "summary": "Shaft with lobes that open the engine's valves.",
    "description": "A camshaft is a rotating shaft with egg-shaped lobes, driven from the crankshaft by a chain, belt or gears.",
    "function": "Opens and closes the engine valves at the right moments.",
    "importance": "Worn lobes or wrong timing cause power loss, noise and possible engine damage.",
    "wear": [
      "Ticking or tapping from the top of the engine",
      "Loss of power or rough idle",
      "Hard starting (visual hints only)"
    ],
    "maintenance": "Regular oil changes and valve clearance checks as your manual describes help protect it.",
    "buying": "Cam profiles differ between models. It is usually replaced with related timing parts.",
    "compatibility": NO_COMPAT,
    "safety": "This is internal engine work for a qualified mechanic. Wrong timing can badly damage the engine."
  },
  "Carburetor": {
    "summary": "Mixes air and fuel for the engine.",
    "description": "A carburetor is a housing with jets, a float chamber and a throttle slide or valve linked to the throttle.",
    "function": "Delivers the right air-fuel mixture for the engine to run.",
    "importance": "A dirty or badly tuned carburetor causes poor starting, rough running and wasted fuel.",
    "wear": [
      "Hard starting or rough idle",
      "Fuel smell or leaking",
      "Hesitation when opening the throttle (visual hints only)"
    ],
    "maintenance": "Use fresh fuel, avoid leaving fuel sitting for long periods, and have it cleaned and tuned as your manual describes.",
    "buying": "Jet sizes and type depend on the model. A cleaning or rebuild kit may be enough.",
    "compatibility": NO_COMPAT,
    "safety": "Fuel is flammable. Work outdoors on a cool engine, away from flames and sparks."
  },
  "Clutch Plate": {
    "summary": "Friction discs that connect engine power to the gearbox.",
    "description": "Clutch plates are a stack of friction and steel plates inside the clutch, usually running in engine oil.",
    "function": "Connect and disconnect engine power from the gearbox so you can pull away and change gear.",
    "importance": "Worn plates slip, drag or grab, which hurts control and wears the engine.",
    "wear": [
      "Revs rising without matching speed (slipping)",
      "Difficulty changing gear",
      "Grabbing or dragging when the lever is pulled (visual hints only)"
    ],
    "maintenance": "Keep clutch free play right and change the oil with the type your manual specifies.",
    "buying": "Plates are normally replaced as a set.",
    "compatibility": NO_COMPAT,
    "safety": "Clutch work is inside the engine and is best done by a qualified mechanic, with the engine off."
  },
  "Crankshaft": {
    "summary": "Turns the piston's up-and-down motion into rotation.",
    "description": "The crankshaft is a heavy shaft with offset journals connected to the pistons by connecting rods.",
    "function": "Converts piston movement into the turning force that drives the motorcycle.",
    "importance": "Damage here is serious and often means an engine rebuild.",
    "wear": [
      "Knocking or rumbling from the lower engine",
      "Heavy vibration",
      "Metal particles in the oil (visual hints only)"
    ],
    "maintenance": "Change oil and filter on schedule, avoid over-revving and act early on any knocking.",
    "buying": "Usually replaced during an engine rebuild, often with bearings and connecting rods.",
    "compatibility": NO_COMPAT,
    "safety": "This is an engine-splitting job for a qualified mechanic."
  },
  "Cylinder Block": {
    "summary": "Main engine body that holds the cylinder where the piston moves.",
    "description": "The cylinder block, or barrel, is a cast metal part with a bore for the piston. It may have cooling fins or coolant passages.",
    "function": "Guides the piston and contains combustion.",
    "importance": "A worn or scored bore causes lost compression and oil burning.",
    "wear": [
      "Blue smoke or oil burning",
      "Loss of power or hard starting",
      "Scoring marks in the bore (visual hints only)"
    ],
    "maintenance": "Keep the engine well oiled and cooled and follow the service schedule.",
    "buying": "Bore size and any oversize options depend on the model. It is usually rebuilt with a new piston and rings.",
    "compatibility": NO_COMPAT,
    "safety": "The part is heavy and gets hot. Engine work is best done by a qualified mechanic."
  },
  "Cylinder Head": {
    "summary": "Top of the engine that seals the cylinder and holds the valves.",
    "description": "The cylinder head is a cast part with the combustion chamber, valves, ports and the spark plug hole.",
    "function": "Seals the top of the cylinder and houses the valves.",
    "importance": "A leaking gasket or damaged head causes power loss, overheating and oil or coolant leaks.",
    "wear": [
      "Leaks around the head gasket",
      "Overheating or white smoke",
      "Loss of compression (visual hints only)"
    ],
    "maintenance": "Check for leaks, keep the cooling system healthy and have valve clearances checked as your manual describes.",
    "buying": "The head gasket and bolts are commonly replaced together.",
    "compatibility": NO_COMPAT,
    "safety": "Tighten only in the sequence and to the values in your manual, and let a qualified mechanic do head work. The head is hot after running."
  },
  "Disc": {
    "summary": "Metal disc the brake pads squeeze to slow the wheel.",
    "description": "This is most likely the brake disc (rotor): a flat steel disc bolted to the wheel that the pads grip.",
    "function": "Gives the pads a surface to grip so the wheel slows.",
    "importance": "A worn or warped disc reduces braking and can damage the pads.",
    "wear": [
      "Deep grooves or ridges",
      "Pulsing at the lever (warping)",
      "Blue heat marks or a very thin disc (visual hints only)"
    ],
    "maintenance": "Measure thickness against the minimum in your manual or stamped on the disc, and keep it free of oil.",
    "buying": "Discs are often replaced with new pads. Match size and mounting to your model.",
    "compatibility": NO_COMPAT,
    "safety": "Have brake work done or checked by a qualified mechanic. Never ride with doubtful brakes. Discs can be very hot."
  },
  "Forks": {
    "summary": "Front suspension tubes that hold the front wheel and absorb bumps.",
    "description": "Telescopic forks are tubes with springs and oil inside. Seals keep the oil in.",
    "function": "Support the front wheel, absorb bumps and help steering and braking.",
    "importance": "Worn or leaking forks hurt handling and braking.",
    "wear": [
      "Oil leaking down the fork tubes",
      "Harsh or bouncy ride",
      "Pitted or bent tubes (visual hints only)"
    ],
    "maintenance": "Keep tubes and seals clean, check for leaks and service the oil as your manual describes.",
    "buying": "Seals, oil and springs are sold separately. Use the oil your manual specifies.",
    "compatibility": NO_COMPAT,
    "safety": "Fork oil on brake parts is dangerous, and bent forks are unsafe. Have fork work done by a qualified mechanic."
  },
  "Fuel Tank": {
    "summary": "Container that holds the fuel.",
    "description": "A fuel tank is a metal or plastic container with a filler cap, a fuel tap or pump and a vent.",
    "function": "Stores fuel and supplies it to the engine.",
    "importance": "Leaks, rust or blocked vents can cause engine problems and fire risk.",
    "wear": [
      "Rust inside the tank",
      "Seeping fuel or fuel smell",
      "A blocked vent (visual hints only)"
    ],
    "maintenance": "Keep the cap sealing well, avoid leaving the tank nearly empty for long periods and use clean fuel.",
    "buying": "Match the tank, cap and fuel fittings to your model.",
    "compatibility": NO_COMPAT,
    "safety": "Fuel is flammable. Keep flames and sparks away and do not ride with a leaking tank."
  },
  "Fuse Box": {
    "summary": "Holds the fuses that protect the electrical system.",
    "description": "A fuse box holds fuses and sometimes relays, often in a small box under the seat or panel.",
    "function": "Cuts the circuit if too much current flows, protecting wiring and parts.",
    "importance": "Fuses prevent damage and fire from electrical faults.",
    "wear": [
      "A fuse that keeps blowing",
      "Melted or discoloured fuse holders",
      "Corroded contacts (visual hints only)"
    ],
    "maintenance": "Keep the box dry and closed and carry spare fuses of the correct rating.",
    "buying": "Always replace a fuse with the same amp rating, never a bigger one.",
    "compatibility": NO_COMPAT,
    "safety": "Never bypass a fuse with wire or foil. A fuse that keeps blowing means a fault that needs checking. Switch the ignition off first."
  },
  "Gear Box": {
    "summary": "Set of gears that lets you change the ratio between engine and wheel.",
    "description": "The gearbox, or transmission, is a set of shafts and gears with a shift mechanism, normally inside the engine casing.",
    "function": "Lets you pick the right gear for pulling away, cruising and climbing.",
    "importance": "Worn gears cause hard shifting, noise and gears that pop out.",
    "wear": [
      "Hard or notchy shifting",
      "Jumping out of gear",
      "Grinding noise (visual hints only)"
    ],
    "maintenance": "Keep the oil level and changes as your manual describes and keep the clutch adjusted.",
    "buying": "Internal parts are usually replaced as matched sets.",
    "compatibility": NO_COMPAT,
    "safety": "Gearbox work is internal and best done by a qualified mechanic."
  },
  "Gear Lever": {
    "summary": "Foot lever used to change gear.",
    "description": "The gear lever sits on the shift shaft with a footpeg tip and sometimes a linkage rod.",
    "function": "Lets you select gears with your foot.",
    "importance": "A loose or bent lever causes missed shifts and poor control.",
    "wear": [
      "Bent or loose lever",
      "Lever turning without shifting (worn splines)",
      "Sloppy shifts (visual hints only)"
    ],
    "maintenance": "Check the pinch bolt is tight, the position is right and any linkage is lubricated.",
    "buying": "Match the lever and linkage to your model.",
    "compatibility": NO_COMPAT,
    "safety": "Check the lever before riding. A loose lever can cause missed shifts."
  },
  "Handlebar": {
    "summary": "Steering bar you hold to control the motorcycle.",
    "description": "The handlebar is a tube with the grips and controls mounted on it, clamped to the steering.",
    "function": "Steers the motorcycle and carries the controls.",
    "importance": "A bent, cracked or loose bar affects control, especially at speed.",
    "wear": [
      "Bends or cracks",
      "Corrosion",
      "Loose clamps or play (visual hints only)"
    ],
    "maintenance": "Check clamp bolts are tight as your manual describes and inspect the bar after any fall.",
    "buying": "Bar width, diameter and mounting differ, so match your model.",
    "compatibility": NO_COMPAT,
    "safety": "Never straighten a bent handlebar. Replace it, because a failure at speed is dangerous."
  },
  "Motorcycle Frame": {
    "summary": "Main structure that holds the engine, wheels and parts.",
    "description": "The frame is a steel or aluminium structure with the steering head, engine mounts and swingarm pivot.",
    "function": "Holds everything together and sets how the bike handles.",
    "importance": "A damaged frame affects handling and safety.",
    "wear": [
      "Cracks near welds",
      "Rust-through or bends",
      "Misalignment after a crash (visual hints only)"
    ],
    "maintenance": "Keep it clean and rust-free and inspect welds and mounts after a crash or hard impact.",
    "buying": "Frames are often tied to registration paperwork. Replacements are rare and should be professionally checked.",
    "compatibility": NO_COMPAT,
    "safety": "A cracked or bent frame needs assessing by a professional. Do not ride it."
  },
  "Piston": {
    "summary": "Moves in the cylinder to compress the mixture and take the combustion force.",
    "description": "A piston is a cylindrical metal part with rings, linked to the crankshaft by a connecting rod.",
    "function": "Compresses the fuel-air mixture and passes combustion force to the crankshaft.",
    "importance": "A worn or damaged piston causes lost power, oil burning and possible engine damage.",
    "wear": [
      "Blue smoke or oil burning",
      "Loss of power or compression",
      "Knocking or piston slap (visual hints only)"
    ],
    "maintenance": "Change oil and air filter on schedule, avoid overheating and over-revving and warm the engine up.",
    "buying": "Piston and ring sizes depend on the bore. They are usually replaced with rings and gaskets.",
    "compatibility": NO_COMPAT,
    "safety": "Internal engine work is best done by a qualified mechanic."
  },
  "Radiator": {
    "summary": "Cools the engine coolant.",
    "description": "A radiator is a finned core with tubes, a cap and hoses, usually with a fan.",
    "function": "Passes heat from the coolant to the air.",
    "importance": "A blocked or leaking radiator causes overheating and engine damage.",
    "wear": [
      "Coolant leaks or stains",
      "Bent or blocked fins",
      "Falling coolant level or overheating (visual hints only)"
    ],
    "maintenance": "Keep the fins clear, check coolant only when cold and change it as your manual describes.",
    "buying": "Use the coolant type and cap rating your manual specifies.",
    "compatibility": NO_COMPAT,
    "safety": "Never open the radiator cap on a hot engine. Coolant is toxic, so keep it away from children and pets."
  },
  "Shock Absorbers": {
    "summary": "Rear suspension units that absorb bumps.",
    "description": "A rear shock is a spring over a damper, usually between the swingarm and the frame.",
    "function": "Absorbs bumps and keeps the rear wheel in contact with the road.",
    "importance": "Worn shocks reduce grip, comfort and stability.",
    "wear": [
      "Oil leaking from the shaft",
      "Bouncy or harsh ride",
      "Sagging or damaged bushings (visual hints only)"
    ],
    "maintenance": "Keep it clean, check for leaks, set preload as your manual describes and replace worn bushings.",
    "buying": "Spring rate depends on the bike and rider weight, so match both.",
    "compatibility": NO_COMPAT,
    "safety": "The spring is under high tension. Do not take a shock apart yourself."
  },
  "Swingarm": {
    "summary": "Pivoting arm that holds the rear wheel.",
    "description": "The swingarm pivots on the frame and carries the rear axle and chain adjusters, on bearings or bushings.",
    "function": "Lets the rear wheel move up and down while holding it in line.",
    "importance": "Play, cracks or bends affect handling and chain alignment.",
    "wear": [
      "Play or clunking at the pivot",
      "Cracks, bends or heavy rust",
      "Uneven chain alignment (visual hints only)"
    ],
    "maintenance": "Grease the pivot as your manual describes and check axle and pivot bolts are tight.",
    "buying": "Bearings and bushings are sold separately.",
    "compatibility": NO_COMPAT,
    "safety": "These fasteners are safety-critical, so have swingarm work done by a qualified mechanic."
  }
};
/* The model calls this class "chain_sprocket"; it uses the existing Sprocket guide. */
const PART_ALIASES = { chain_sprocket: "Sprocket" };
const SUPPORTED_PARTS = Object.keys(PARTS_DATA);
