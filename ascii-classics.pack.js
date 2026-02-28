/**
 * BIFROST THEME PACK: ASCII CLASSICS
 * Retro gaming, fantasy, and classic ASCII animations from the Pico library
 */
Bifrost.registerPack({
  id: 'ascii-classics',
  name: 'ASCII Classics',
  version: '1.0.0',
  icon: '🎮',
  description: 'Retro gaming and fantasy ASCII animations',

  effects: {},  // No standard effects — this pack is ASCII-only

  ascii: {
    sword: {
      label: 'Sword Fight', icon: '⚔️',
      frames: [
        '--    --', ' --  -- ', ' /    \\ ', ' /   \\  ', ' /---   ', '/---    ',
        '/\\      ', '/ \\     ', '\\  \\  ', ' |   \\ ', ' |    \\ ',
        ' |    | ', ' \\    / ', '  \\  /  ', '   \\/   ', '  *X*   ',
        '  / \\   ', ' /   \\  ', ' /    \\ ', ' /    \\ ',
        ' __   \\ ', ' __   \\ ', ' __    \\', ' __      ', ' __      '
      ],
      speed: 150
    },
    portal: {
      label: 'Portal', icon: '🌀',
      frames: [
        '   .    ', '  ( )   ', ' (( ))  ', '((( ))) ', '(((O))) ',
        '(((@))) ', '(((O))) ', '((( ))) ', ' (( ))  ', '  ( )   ', '   .    '
      ],
      speed: 200
    },
    dragon: {
      label: 'Dragon', icon: '🐉',
      frames: [
        '<==<    ', '<=<     ', '<==<    ', '<==<~   ', '<==<~~  ',
        '<==<~~~ ', '<==<~~~~', '<==<~~~ ', '<==<~~  ', '<==<~   ', '<==<    '
      ],
      speed: 300
    },
    zelda_heart: {
      label: 'Zelda Heart', icon: '💚',
      frames: [
        '\u2665\u2665    ', '\u2665\u2665\u2665  ', '\u2665\u2665    ', '\u2665\u2665\u2665  ',
        '\u2665\u2665    ', '\u2665     ', '\u2665\u2665   ', '\u2665     ',
        '\u2665\u2665   ', '\u2665     ', '  ~*~  ', ' +~*~+ ',
        '++~*~++', ' +~*~+ ', '  ~*~  ', '\u2665\u2665\u2665    ', '\u2665\u2665\u2665 '
      ],
      speed: 300
    },
    pacman_chase: {
      label: 'Pac-Man Chase', icon: '👾',
      frames: [
        'C  .*..   ', ' C .*..  A', '  C.*.. A ', '   C*..A  ',
        '    C.. A ', '     C.  A', '      C   ', '       C  ', '        C '
      ],
      speed: 150
    },
    snake_game: {
      label: 'Snake', icon: '🐍',
      frames: [
        'o------  ', '-o-----  ', '--o----  ', '---o---  ',
        '----o--  ', '-----o-  ', '------o  ', '------o* ', 'ooooooo* '
      ],
      speed: 200
    },
    space_battle: {
      label: 'Space Battle', icon: '🚀',
      frames: [
        '^   v    ', '^  v v   ', '^ v * v  ', '^v  *  v ',
        'v   *   ^', '   ***   ', '  *****  ', ' ******* ', '    *    '
      ],
      speed: 100
    },
    coin_collect: {
      label: 'Coin Collect', icon: '🪙',
      frames: [
        '   (o)   ', '  ((o))  ', ' (((o))) ', '((((o))))',
        '  DING!  ', '   +10   ', '         '
      ],
      speed: 200
    },
    wizard: {
      label: 'Wizard', icon: '🧙',
      frames: [
        ' /o\\/     ', ' /o\\/     ', ' /o\\--    ', ' /O\\--*   ',
        ' /0\\--**  ', ' /O\\--*** ', ' /0\\--****', ' /O\\--**  ',
        ' /o\\--*   ', ' /o\\/     '
      ],
      speed: 275
    },
    castle: {
      label: 'Castle', icon: '🏰',
      frames: [
        ' [][]          [][] \n[][][]        [][][]\n[]||[]        []||[]\n[]||[]        []||[]\n[]||[][[][][]][]||[]\n[]||[][[][][]][]||[]\n[]||[][[][][]][]||[]\n[][][][[][][]][][][]\n[][][][[][][]][][][]'
      ],
      speed: 1000
    },
    phaser_charge: {
      label: 'Phaser Charge', icon: '🔫',
      frames: [
        '[>      ]', '[=>     ]', '[==>    ]', '[===>   ]',
        '[====>  ]', '[=====> ]', '[======>]', '[FIRE!!!]', '[>      ]'
      ],
      speed: 150
    },
    alien_message: {
      label: 'Alien Message', icon: '👽',
      frames: [
        '...---...', '..--.-..' , '.-..-..-', '--..--.-',
        'DECODING.', 'DECODING..', 'HELLO   ', 'HUMAN   ', '...---...'
      ],
      speed: 300
    },
    void_scream: {
      label: 'Void Scream', icon: '🕳️',
      frames: [
        '         ', '    .    ', '   ...   ', '  .....  ',
        ' ....... ', '.........', 'AAAAAAA!!', '!!!!!!!!!!', '         '
      ],
      speed: 200
    },
    reality_break: {
      label: 'Reality Break', icon: '💀',
      frames: [
        'NORMAL   ', 'N0RMAL   ', 'N0RM4L   ', 'N0?M4!   ',
        '?0?!4!   ', '?!?!?!   ', '@#$%^&   ', 'ER!R0!R  ', '404_REAL '
      ],
      speed: 100
    },
    rocket_launch: {
      label: 'Rocket Launch', icon: '🚀',
      frames: [
        '   ^   \n  /^\\  \n  |=|  \n /|=|\\ \n  |=|  \n  / \\  ',
        '   ^   \n  /^\\  \n  |=|  \n /|=|\\ \n  |=|  \n /***\\ ',
        '   ^   \n  /^\\  \n  |=|  \n /|=|\\ \n  |=|  \n/**|**\\',
        '   ^   \n  /^\\  \n  |=|  \n /|=|\\ \n /**\\ \n/ *** \\',
        '  /^\\  \n  |=|  \n /|=|\\ \n /**\\ \n/ *** \\\n  ***  ',
        '  |=|  \n /|=|\\ \n /**\\ \n/ *** \\\n  ***  \n   *   '
      ],
      speed: 150
    },
    fish: {
      label: 'Fish', icon: '🐟',
      frames: [
        '><>    ', ' ><>   ', '  ><>  ', '   ><> ',
        '    ><>', '     <>', '    <><', '   <>< ',
        '  <><  ', ' <><   ', '<><    ', '<>     '
      ],
      speed: 300
    },
    breathing: {
      label: 'Breathing', icon: '🫁',
      frames: [
        '   ()   ', '  (  )  ', ' (    ) ', '(      )',
        '(      )', '(      )', ' (    ) ', '  (  )  ',
        '   ()   ', '   ..   '
      ],
      speed: 600
    },
  }
});
