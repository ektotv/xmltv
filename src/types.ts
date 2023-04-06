/**
 * A representation of XMLTV data in TypeScript.
 *
 * @see http://wiki.xmltv.org/index.php/XmltvFormat
 */

/**
 * A URL to an image about the programme.
 *
 * The type of the image may be identified by the 'type' attribute. For programmes
 * this could be 'poster' or 'backdrop' (marketing promo photos)  or 'still' (screenshot from the
 * programme itself).
 *
 * If multiple image elements of a particular type are given, the most authoritative or official
 * images should be listed first.
 *
 * The `system` attribute may be used to identify the source of the image, or some useful feature
 * of the target (e.g. 'imdb','tmdb',etc.).
 *
 * The `orient` attribute defines the orientation of the image "P" portrait or "L" landscape
 *
 * The `size` attribute may be used to indicate the relative size of the image.
 * Possible values are:
 * "1" is < 200px in its largest dimension
 * "2" is 200-400px in its largest dimension
 * "3" is > 400px in its largest dimension
 * Multiple images of different sizes is permitted (e.g. small poster and large poster).
 */
export type XmltvImage = {
  /**
   * Type of image
   */
  type?: "poster" | "backdrop" | "still";

  /**
   * URL of the image
   */
  _value: string;

  /**
   * Size of the image
   *
   * Possible values are:
   * "1" is < 200px in its largest dimension
   * "2" is 200-400px in its largest dimension
   * "3" is > 400px in its largest dimension
   */
  size?: 1 | 2 | 3;

  /**
   * Orientation of the image
   *
   * Possible values are:
   * - "L" = landscape
   * - "P" = portrait
   */
  orient?: "L" | "P" | "l" | "p";

  /**
   * A string to describe where the image came from, eg IMDB
   */
  system?: string;
};

/**
 * Similar to XmltvImage but with a types for the credit images.
 *
 * It could be 'person' (general portfolio picture of the person) or 'character'
 * (photo taken from the programme showing the actor in character).
 */
export type XmltvCreditImage = XmltvImage & {
  /**
   * Type of image
   */
  type?: "person" | "character";
};

/**
 * A representation of a person in an XMLTV programme object.
 */
export type XmltvPerson = {
  /**
   * The name of the person.
   */
  _value: string;

  /**
   * The role of the actor in the programme eg Bryan Cranston's role in Breaking Bad is "Walter White".
   */
  role?: string;

  /**
   * Whether the person is a guest star or a regular cast member.
   */
  guest?: boolean;

  /**
   * An image of the person.
   */
  image?: XmltvCreditImage[];

  /**
   * The URL of the person.
   */
  url?: XmltvUrl[];
};

/**
 * A representation of the credits for an XMLTV programme object.
 *
 * People are listed in decreasing order of importance; so for example the starring actors appear
 * first followed by the smaller parts.  As with other parts of this file format, not mentioning
 * a particular actor (for example) does not imply that he _didn't_ star in the film - so normally
 * you'd list only the few most important people.
 *
 * Adapter can be either somebody who adapted a work for television, or somebody who did the translation
 * from another lang. The distinction is not always clear.
 *
 * URL can be, for example, a link to a webpage with more information about the actor, director, etc..
 */
export type XmltvCredits = {
  /**
   * The director(s) of the programme.
   */
  director?: XmltvPerson[];

  /**
   * The actor(s) in the programme.
   */
  actor?: XmltvPerson[];

  /**
   * The writer(s) of the programme.
   */
  writer?: XmltvPerson[];

  /**
   * The adapter(s) of the programme.
   */
  adapter?: XmltvPerson[];

  /**
   * The producer(s) of the programme.
   */
  producer?: XmltvPerson[];

  /**
   * The composer(s) of the programme.
   */
  composer?: XmltvPerson[];

  /**
   * The editor(s) of the programme.
   */
  editor?: XmltvPerson[];

  /**
   * The presenter(s) of the programme.
   */
  presenter?: XmltvPerson[];

  /**
   * The commentator(s) of the programme.
   */
  commentator?: XmltvPerson[];

  /**
   * The guest(s) of the programme.
   */
  guest?: XmltvPerson[];
};

/**
 * A way to define multiple strings with different langs for the same value.
 */
type XmltvStringWithLang = {
  /**
   * The value of the string
   */
  _value: string;

  /**
   * The lang code of the string eg. "en" for English, "es" for Spanish, etc.
   */
  lang?: string;
};

/**
 * The channel display name with an optional language attribute.
 */
export type XmltvDisplayName = XmltvStringWithLang;

/**
 * The title of a programme with an optional language attribute.
 */
export type XmltvTitle = XmltvStringWithLang;

/**
 * The subtitle of a programme with an optional language attribute.
 */
export type XmltvSubTitle = XmltvStringWithLang;

/**
 * The description of a programme with an optional language attribute.
 */
export type XmltvDesc = XmltvStringWithLang;

/**
 * The category of a programme with an optional language attribute.
 */
export type XmltvCategory = XmltvStringWithLang;

/**
 * The keyword related to a programme with an optional language attribute.
 */
export type XmltvKeyword = XmltvStringWithLang;

/**
 * The language of a programme with an optional language attribute.
 */
export type XmltvLanguage = XmltvStringWithLang;

/**
 * The original language of a programme with an optional language attribute.
 */
export type XmltvOrigLanguage = XmltvStringWithLang;

/**
 * The country where a programme was produced with an optional language attribute.
 */
export type XmltvCountry = XmltvStringWithLang;

/**
 * The premiere information for a programme with an optional language attribute.
 */
export type XmltvPremiere = XmltvStringWithLang;

/**
 * The last chance information for a programme with an optional language attribute.
 */
export type XmltvLastChance = XmltvStringWithLang;

/**
 * Object describing an icon
 *
 * The icon element is used to specify an image that represents the programme or channel,
 * typically a logo or thumbnail image. The src attribute of the icon element is required
 * and specifies the URL of the image file. The width and height attributes are optional
 * and specify the dimensions of the image in pixels. The icon element is optional and
 * can be used within the channel and programme elements to provide visual information
 * about the channel or programme being described.
 */
export type XmltvIcon = {
  /**
   * URL of the icon
   */
  src: string;

  /**
   * Width of the icon
   */
  width?: number;

  /**
   * Height of the icon
   */
  height?: number;
};

/**
 * Object describing a URL, used in the programme and channel objects.
 */
export type XmltvUrl = {
  /**
   * Value of the URL
   */
  _value: string;

  /**
   * System of the URL, eg "imdb", "thetvdb", etc.
   */
  system?: string;
};

/**
 * Episode number
 */
export type XmltvEpisodeNumber = {
  /**
   * The episode number as a standard SxxExx string.
   * This is the preferred way to specify the episode number.
   */
  system?: "onscreen" | "xmltv_ns";

  /**
   * The episode number as a XMLTV episode number string eg. "2.3.2".
   */
  _value?: string;
};

/**
 * Object describing details of the programme's video
 */
export type XmltvVideo = {
  /**
   * Whether this programme has a picture (no, in the case of radio stations broadcast
   * on TV or 'Blue'). If this attribute is missing, it is assumed to be `true`.
   */
  present?: boolean;

  /**
   * `true` for colour, `false` for black-and-white.
   */
  colour?: boolean;

  /**
   * The horizontal:vertical aspect ratio, eg `4:3` or `16:9`.
   */
  aspect?: string;

  /**
   * Information on the quality, eg `HDTV`, `800x600`.
   */
  quality?: string;
};

/**
 * The programme rating eg TV-MA, PG, etc.
 */
export type XmltvRating = {
  /**
   * Value of the rating
   */
  value: string;

  /**
   * System of the rating eg. MPAA, VCHIP, etc.
   */
  system?: string;

  /**
   * Icon of the rating
   */
  icon?: XmltvIcon[];
};

/**
 * Audio details, similar to video details.
 *
 * `present`: Whether this programme has any sound at all.
 * `stereo`: Description of the stereo-ness of the sound.  Legal values
 * are currently `mono`,`stereo`,`dolby`,`dolby digital`,`bilingual` and `surround`.
 */
export type XmltvAudio = {
  /**
   * Whether this programme has any sound at all.
   */
  present?: boolean;

  /**
   * Description of the stereo-ness of the sound.
   *
   * `bilingual` in this case refers to a single audio stream where the left and right
   * channels contain monophonic audio  in different langs.  Other values may be added later.
   */
  stereo?:
    | "mono"
    | "stereo"
    | "dolby"
    | "dolby digital"
    | "bilingual"
    | "surround";
};

/**
 * The true length of the programme, not counting advertisements or trailers.
 * But this does take account of any bits which were cut out of the broadcast version
 * - eg if a two hour film is cut to 110 minutes and then padded with 20 minutes of advertising,
 * length will be 110 minutes even though end time minus start time is 130 minutes.
 */
export type XmltvLength = {
  /**
   * The length of the programme
   */
  _value: number;

  /**
   * The units of the length
   *
   */
  units: "seconds" | "minutes" | "hours";
};

/**
 * These can be either `teletext` (sent digitally, and displayed at the viewer's request),
 * `onscreen` (superimposed on the picture and impossible to get rid of),
 * or 'deaf-signed' (in-vision signing for users of sign lang).
 *
 * You can have multiple subtitle streams to handle different langs.
 * lang for subtitles is specified in the same way as for programmes.
 */
export type XmltvSubtitle = {
  type?: "teletext" | "onscreen" | "deaf-signed";
  language?: XmltvStringWithLang;
};

/**
 * When and where the programme was last shown, if known.  Normally in TV listings 'repeat'
 * means 'previously shown on this channel', but if you don't know what channel the old
 * screening was on (but do know that it happened) then you can omit the 'channel' attribute.
 * Similarly you can omit the 'start' attribute if you don't know when the previous transmission
 * was (though you can of course give just the year, etc.).
 */
export type XmltvPreviouslyShown = {
  start?: Date;
  channel?: string;
};

/**
 * A review of the programme.
 * Either the text of the review, or a URL that links to it.
 */
export type XmltvReview = {
  /**
   * The value of this element must be either the text of the review, or a URL that links to it.
   */
  _value: string;

  /**
   * The type of review
   */
  type: "text" | "url";

  /**
   * The source of the review
   */
  source?: string;

  /**
   * The author of the review
   */
  reviewer?: string;

  /**
   * The lang of the review
   */
  lang?: string;
};

export type XmltvStarRating = {
  /**
   * The value of this element should be 'N / M', for example one star out of a possible five stars would be '1 / 5'.
   */
  value: string;

  /**
   * The system used to provide the star rating
   */
  system?: string;

  /**
   * Icon for the star rating
   */
  icon?: XmltvIcon[];
};

/**
 * Object describing a programme
 */
export type XmltvProgramme = {
  /**
   * The channel id for the program (see `XmltvChannel`)
   * This is a string that uniquely identifies the channel on which the programme is broadcast.
   *
   * @example
   * ```typescript
   * {
   *   channel: 'bbc1.uk'
   * }
   * ```
   */
  channel: string;

  /**
   * Title of the program in different langs
   *
   * @example
   * ```typescript
   * {
   *   title: [
   *     { _value: 'The Simpsons', lang: 'en' },
   *     { _value: 'Los Simpson', lang: 'es' },
   *     { _value: 'Les Simpson', lang: 'fr' },
   *   ]
   * }
   * ```
   */
  title: XmltvTitle[];

  /**
   * Start time of the program
   *
   * @example
   * ```typescript
   * {
   *   start: new Date('2019-01-01T00:00:00Z');
   * }
   * ```
   */
  start: Date;

  /**
   * Stop time of the program
   *
   * @example
   * ```typescript
   * {
   *   stop: new Date('2019-01-01T00:00:00Z');
   * }
   * ```
   */
  stop?: Date;

  /**
   * The PDC (Program Delivery Control) start time of the programme.
   * This is used to mark the actual start time of a broadcast in a tape-based recording system.
   *
   * PDC stands for Programme Delivery Control. PDC start time is a signal that is transmitted
   * along with the television signal to synchronize the VCR's timer with the beginning of a program.
   * The PDC start time is the precise start time of a television program, accurate to the second,
   * and is useful for programming VCRs to record a particular program.
   *
   * @example
   * ```typescript
   * {
   *   pdcStart: new Date('2019-01-01T00:00:00Z');
   * }
   * ```
   */
  pdcStart?: Date;

  /**
   * VPS start time of the program
   *
   * VPS stands for Video Programming System, a system used in some countries to synchronize the
   * start and end times of television programs. The VPS start time is an optional field in the
   * XMLTV DTD that specifies the start time of the programme according to the VPS system.
   *
   * @example
   * ```typescript
   * {
   *   vpsStart: new Date('2019-01-01T00:00:00Z');
   * }
   * ```
   */
  vpsStart?: Date;

  /**
   * Showview code for the program
   *
   * Showview is a system used in some countries to identify TV programs. It is a six-digit code
   * assigned to each program that provides a unique identifier, which can be used to look up
   * program information in a database. In the XMLTV DTD, the showView attribute is an optional
   * field that specifies the Showview code for the programme.
   *
   * @example
   * ```typescript
   * {
   *   showView: '123456'
   * }
   * ```
   */
  showview?: string;

  /**
   * Video Plus+ code for the program
   *
   * Video Plus+ (VPS+) is a system used in some countries to set the timer of a VCR (Video Cassette Recorder)
   * to record a specific TV program. It works by assigning a code to each program in the TV listings that
   * can be entered into the VCR timer. The VCR then starts recording at the specified time, without the
   * need for the user to set the timer manually. In the XMLTV DTD, the videoplus attribute is an optional
   * field that specifies the Video Plus+ code for the programme.
   *
   * @example
   * ```typescript
   * {
   *   videoPlus: 'V123456'
   * }
   * ```
   */
  videoplus?: string;

  /**
   * Clump index for the program
   *
   * TV listings sometimes have the problem of listing two or more programmes in the same timeslot,
   * such as 'News; Weather'. We call this a 'clump' of programmes, and the `clumpIndex` attribute
   * differentiates between two programmes sharing the same timeslot and channel.
   * In this case News would have clumpIndex="0/2" and Weather would have clumpidx: "1/2".
   *
   * If you don't have this problem, be thankful!
   *
   * @example
   * ```typescript
   * {
   *   clumpidx: '0/2'
   * }
   * ```
   *
   */
  clumpidx?: string;

  /**
   * Subtitle of the program in different langs
   *
   * @example
   * ```typescript
   * {
   *   subTitle: [
   *     { _value: 'Treehouse of Horror XXVII', lang: 'en' },
   *     { _value: 'El árbol de los horrores XXVII', lang: 'es' },
   *     { _value: "Le manoir de l'horreur XXVII", lang: 'fr' },
   *   ]
   * }
   * ```
   */
  subTitle?: XmltvSubTitle[];

  /**
   * Description of the program in different langs
   *
   * @example
   * ```typescript
   * {
   *   desc: [
   *     { _value: 'The Simpsons go to a haunted house.', lang: 'en' },
   *     { _value: 'Los Simpson van a una casa embrujada.', lang: 'es' },
   *     { _value: 'Les Simpson vont dans une maison hantée.', lang: 'fr' },
   *   ]
   * }
   * ```
   */
  desc?: XmltvDesc[];

  /**
   * Credits for the program, including director, actors, writers, etc.
   *
   * @example
   * ```typescript
   * {
   *   credits: {
   *     directors: [{ _value: 'David Silverman' }],
   *     actors: [
   *       { _value: 'Dan Castellaneta', role: 'Homer Simpson' },
   *       { _value: 'Julie Kavner', role: 'Marge Simpson' },
   *       { _value: 'Nancy Cartwright', role: 'Bart Simpson' },
   *       { _value: 'Yeardley Smith', role: 'Lisa Simpson' },
   *     ],
   *   }
   * }
   */
  credits?: XmltvCredits;

  /**
   * Date of the program in YYYYMMDD format
   *
   * The date the programme or film was finished.  This will probably be the same as the copyright date.
   *
   * @example
   * ```typescript
   * {
   *  date: '20190101'
   * }
   * ```
   */
  date?: Date;

  /**
   * Category of the program in different langs
   *
   * @example
   * ```typescript
   * {
   *   categories: [
   *     { : 'Comedy', lang: 'en' },
   *     { : 'Comedia', lang: 'es' },
   *     { : 'Comédie', lang: 'fr' },
   *   ]
   * }
   * ```
   */
  category?: XmltvCategory[];

  /**
   * Keyword for the program in different langs
   *
   * @example
   * ```typescript
   * {
   *   keywords: [
   *     { _value: 'Halloween', lang: 'en' },
   *     { _value: 'Halloween', lang: 'es' },
   *     { _value: 'Halloween', lang: 'fr' },
   *   ]
   * }
   * ```
   */
  keyword?: XmltvKeyword[];

  /**
   * language used in the program
   *
   * @example
   * ```typescript
   * {
   *  language: 'en'
   * }
   * ```
   */
  language?: XmltvLanguage;

  /**
   * Original lang of the program
   *
   * @example
   * ```typescript
   * {
   *   origLanguage: 'en'
   * }
   * ```
   */
  origLanguage?: XmltvOrigLanguage;

  /**
   * Length of the program
   *
   * @example
   * ```typescript
   * {
   *   length: {
   *     units: 'minutes',
   *     _value: 30
   *   }
   * }
   * ```
   */
  length?: XmltvLength;

  /**
   * Icon for the program
   *
   * @example
   * ```typescript
   * {
   *   icon: {
   *     src: 'https://example.com/icon.png',
   *     width: 32,
   *     height: 32
   *   }
   * }
   * ```
   */
  icon?: XmltvIcon[];

  /**
   * URL for the program
   *
   * @example
   * ```typescript
   * {
   *   url: {
   *    _value: 'https://example.com/program',
   *    system: 'imdb'
   *   }
   * }
   * ```
   */
  url?: XmltvUrl[];

  /**
   * Country of the program
   *
   * @example
   * ```typescript
   * {
   *   country: 'US'
   * }
   * ```
   */
  country?: XmltvCountry;

  /**
   * Episode number for the program in either "onscreen" or "xmltv_ns" format
   *
   * @example
   * ```typescript
   * {
   *   episodeNum: [{
   *     _value: 'S27E07',
   *     type: '27.7'
   *   }]
   * }
   * ```
   */
  episodeNum?: XmltvEpisodeNumber[];

  /**
   * Video details, including aspect ratio, whether it is in colour or black and white, etc.
   *
   * @example
   * ```typescript
   * {
   *   video: {
   *     present: true,
   *     colour: true,
   *     aspect: '16:9',
   *     quality: 'HDTV'
   *   }
   * }
   * ```
   */
  video?: XmltvVideo;

  /**
   * Audio details, similar to video details.
   *
   * @example
   * ```typescript
   * {
   *   audio: {
   *     present: true,
   *     stereo: 'stereo'
   *   }
   * }
   * ```
   */
  audio?: XmltvAudio;

  /**
   * When and where the programme was last shown, if known.  Normally in TV listings 'repeat'
   * means 'previously shown on this channel', but if you don't know what channel the old
   * screening was on (but do know that it happened) then you can omit the 'channel' attribute.
   *
   * Similarly you can omit the 'start' attribute if you don't know when the previous transmission
   * was (though you can of course give just the year, etc.).
   *
   * The absence of this element does not say for certain that the programme is brand new and
   * has never been screened anywhere before.
   *
   * @example
   * ```typescript
   * {
   *   previouslyShown: {
   *     start: '2019-01-01T00:00:00Z',
   *     channel: 'example.com'
   *   }
   * }
   * ```
   *
   */
  previouslyShown?: XmltvPreviouslyShown;

  /**
   * Premiere details for the program in different langs
   *
   * Different channels have different meanings for this word - sometimes it means a film
   * has never before been seen on TV in that country, but other channels use it to mean
   * 'the first showing of this film on our channel in the current run'.  It might have been
   * shown before, but now they have paid for another set of showings, which makes the first
   * in that set count as a premiere!
   *
   * So this element doesn't have a clear meaning, just use it to represent where 'premiere'
   * would appear in a printed TV listing. You can use the content of the element to explain
   * exactly what is meant.
   *
   * @example
   * ```typescript
   * {
   *   premiere:'First showing on this channel'
   * }
   * ```
   *
   * If you don't want to give an explanation, just set it to true:
   *
   * @example
   * ```typescript
   * {
   *   premiere: true
   * }
   * ```
   */
  premiere?: XmltvStringWithLang | boolean;

  /**
   * Last chance details for the program in different langs
   *
   * In a way this is the opposite of premiere.  Some channels buy the rights to show a
   * movie a certain number of times, and the first may be flagged 'premiere',
   * the last as 'last showing'.
   *
   * For symmetry with premiere, you may use the element content to give a 'paragraph'
   * describing exactly what is meant - it's unlikely to be the last showing ever!
   * Otherwise, explicitly put empty content.
   *
   * @example
   * ```typescript
   * {
   *   lastChance: 'Last showing on this channel'
   * }
   * ```
   */
  lastChance?: XmltvStringWithLang | boolean;

  /**
   * This is the first screened programme from a new show that has never been shown on television
   * before (if not worldwide then at least never before in this country).
   *
   * After the first episode or programme has been shown, subsequent ones are no longer 'new'.
   * Similarly the second series of an established programme is not 'new'.
   *
   * Note that this does not mean 'new season' or 'new episode' of an existing show.
   * You can express part of that using the episode-num stuff.
   *
   * @example
   * ```typescript
   * {
   *   new: true
   * }
   * ```
   */
  new?: boolean;

  /**
   * Subtitles details for the program
   *
   * @example
   * ```typescript
   * {
   *   subtitles: [
   *     { type: 'teletext', language: {_value: 'English'} },
   *     { type: 'onscreen', language: {_value: 'French', lang: 'fr'} }
   *   ]
   * }
   * ```
   */
  subtitles?: XmltvSubtitle[];

  /**
   * Various bodies decide on classifications for films - usually a minimum age you must be to see it.
   * In principle the same could be done for ordinary TV programmes. Because there are many systems for
   * doing this, you can also specify the rating system used eg MPAA, VCHIP, etc.
   *
   * @example
   * ```typescript
   * {
   *   system: 'MPAA',
   *   _value: 'PG',
   *   icon: [{
   *     src: 'https://www.themoviedb.org/assets/1/v4/logos/32x32-blue-1f8b5c2fda197d0ee7d4f5b9fdca72a67ac3c9f7f8f8f8f8f8f8f8f8f8f8f8f8f.png',
   *     width: 32,
   *     height: 32
   *   }]
   * }
   * ```
   *
   */
  rating?: XmltvRating[];

  /**
   * Star rating for the program, including value and system
   *
   * Star rating' - many listings guides award a programme a score as a quick guide to how good it is.
   * The value of this element should be 'N / M', for example one star out of a possible five stars would be '1 / 5'.
   *
   * Zero stars is also a possible score (and not the same as 'unrated').  You should try to map whatever wacky system
   * your listings source uses to a number of stars: so for example if they have thumbs up, thumbs sideways and thumbs down,
   * you could map that to two, one or zero stars out of two.
   *
   * If a programme is marked as recommended in a listings guide you could map this to '1 / 1'.
   *
   * Because there could be many ways to provide star-ratings or recommendations for a programme, you can specify
   * multiple star-ratings. You can specify the star-rating system used, or the provider of the recommendation,
   * with the system attribute. Whitespace between the numbers and slash is ignored.
   *
   * @example
   * ```typescript
   * {
   *   starRating: [{
   *     value: '1 / 5',
   *     system: 'IMDB',
   *     icon: {
   *       src: 'https://www.themoviedb.org/assets/1/v4/logos/32x32-blue-1f8b5c2fda197d0ee7d4f5b9fdca72a67ac3c9f7f8f8f8f8f8f8f8f8f8f8f8f8f.png',
   *       width: 32,
   *       height: 32
   *     }
   *   }]
   * }
   * ```
   */
  starRating?: XmltvStarRating[];

  /**
   * Review details for the program
   *
   * Listings guides may provide reviews of programmes in addition to, or in place of, standard
   * programme descriptions. They are usually written by in-house reviewers, but reviews can also
   * be made available by third-party organisations/individuals. The value of this element must
   * be either the text of the review, or a URL that links to it. Optional attributes giving the
   * review source and the individual reviewer can also be specified.
   *
   * @example
   * ```typescript
   * {
   *  review: {
   *   _value: 'https://www.imdb.com/title/tt0111161/reviews',
   *  type: 'url',
   * source: 'IMDB',
   * reviewer: 'John Doe',
   * lang: 'en'
   * }
   * ```
   *
   * @example
   * ```typescript
   * {
   *   review: [{
   *     _value: 'A great movie',
   *     type: 'text',
   *     source: 'IMDB',
   *     reviewer: 'John Doe',
   *     lang: 'en'
   *   }]
   * }
   * ```
   */
  review?: XmltvReview[];

  /**
   * Images associated with the program
   *
   * @example
   * ```typescript
   * {
   *   images: [{
   *     src: 'https://www.themoviedb.org/assets/1/v4/logos/32x32-blue-1f8b5c2fda197d0ee7d4f5b9fdca72a67ac3c9f7f8f8f8f8f8f8f8f8f8f8f8f8f.png',
   *     type: 'poster
   *     orient: 'L',
   *     size: 3
   *   }]
   * }
   * ```
   */
  image?: XmltvImage[];
};

/**
 * The channel details
 */
export type XmltvChannel = {
  /**
   * The channel id
   *
   * @example
   * ```typescript
   * {
   *   id: 'channel-1'
   * }
   * ```
   */
  id: string;

  /**
   * The channel display name
   *
   * @example
   * ```typescript
   * {
   *   displayName: [{
   *     _value: 'Channel 1',
   *     lang: 'en'
   *   },{
   *     _value: 'Kanal 1',
   *     lang: 'de'
   *   }]
   * }
   * ```
   */
  displayName: XmltvDisplayName[];

  /**
   * The channel icon
   *
   * @example
   * ```typescript
   * {
   *   icon: [{
   *     src: 'https://www.themoviedb.org/assets/1/v4/logos/32x32-blue-1f8b5c2fda197d0ee7d4f5b9fdca72a67ac3c9f7f8f8f8f8f8f8f8f8f8f8f8f8f.png',
   *     width: 32,
   *     height: 32
   *   }]
   * }
   * ```
   */
  icon?: XmltvIcon[];

  /**
   * The channel url
   *
   * @example
   * ```typescript
   * {
   *   url: [{_value: 'https://www.channel1.com'}]
   * ]
   * ```
   */
  url?: XmltvUrl[];
};

export type Xmltv = {
  channels?: XmltvChannel[];
  programmes?: XmltvProgramme[];
  date?: Date;
  sourceInfoName?: string;
  generatorInfoName?: string;
  sourceInfoUrl?: string;
  sourceDataUrl?: string;
  generatorInfoUrl?: string;
};

/**
 * A single XMLTV DOM node
 *
 * @example
 * ```typescript
 * {
 *   tagName: 'programme',
 *   attributes: {
 *     start: '20210101000000 +0100',
 *     stop: '20210101010000 +0100',
 *     channel: 'channel-1'
 *   },
 *   children: [{
 *     tagName: 'title',
 *     attributes: {
 *       lang: 'en'
 *     },
 *     children: ['Programme title']
 *   }]
 * }
 * ```
 */
export type XmltvDomNode =
  | {
      tagName: string;
      attributes: Record<string, any>;
      children: Array<XmltvDomNode | string>;
    }
  | string;

/**
 * A collection of XMLTV DOM nodes to form a valid XMLTV document
 *
 */
export type XmltvDom = XmltvDomNode[];
