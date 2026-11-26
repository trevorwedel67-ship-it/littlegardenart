// Starting catalog. Used until Patsy saves her first change from /admin.
export const DEFAULT_CATALOG = {
  deadline: "Dec 12",
  cards: [
    { id: "warmest", t: "Warmest Wishes", img: "main-street.jpg", inside: "This Christmas Season", hidden: false,
      d: "A snowy evening on an old-time main street: the soda fountain, the saddlery and the 1911 bank, with a family out walking the new baby.",
      packs: [{ l: "Single card", p: 5 }, { l: "Pack of 5", p: 20 }, { l: "Pack of 10", p: 36 }] },
    { id: "blessings", t: "Christmas Blessings", img: "church.jpg", inside: "And a Beautiful New Year", hidden: false,
      d: "A whitewashed country church in fresh snow, lit windows and a wreath on the door, tucked between tall spruces.",
      packs: [{ l: "Single card", p: 5 }, { l: "Pack of 5", p: 20 }, { l: "Pack of 10", p: 36 }] }
  ],
  art: [
    { id: "pronghorn", t: "Harrington Reservoir", m: "Acrylic on stretched canvas, painted edges", size: "", c: "acrylic", p: 250, img: "pronghorn.jpg", a: "Pronghorn and a white dog beside a blue reservoir under red bluffs" },
    { id: "main-street", t: "Main Street at Christmas", m: "Acrylic, the original behind the Warmest Wishes card", size: "", c: "acrylic", p: 225, img: "main-street.jpg", a: "Snowy old-time main street at night" },
    { id: "church", t: "Country Church in Snow", m: "Acrylic on paper, the original behind Christmas Blessings", size: "", c: "acrylic", p: 150, img: "church.jpg", a: "White church with a steeple in the snow among spruce trees" },
    { id: "farmhouse", t: "Farmhouse and Barn", m: "Acrylic on canvas panel", size: "", c: "acrylic", p: 150, img: "farmhouse.jpg", a: "Cream farmhouse, wooden barn and tall green trees" },
    { id: "moose", t: "Moose and Calf", m: "Watercolor and pencil", size: "", c: "watercolor", p: 95, img: "moose.jpg", a: "Cow moose and calf near a yellow cabin below snowy mountains" },
    { id: "red-barn", t: "Red Barn, Spring Lambs", m: "Watercolor", size: "", c: "watercolor", p: 95, img: "red-barn.jpg", a: "Red barn with sheep and lambs in a yellow spring field" },
    { id: "dunes", t: "The Path to the Beach", m: "Watercolor", size: "", c: "watercolor", p: 85, img: "dunes.jpg", a: "Sandy path through dune grass to the ocean with a sailboat" },
    { id: "chile", t: "Chile, S.A.", m: "Watercolor and ink", size: "", c: "watercolor", p: 85, img: "chile.jpg", a: "Adobe house with a tile roof beside a railroad and poplars" },
    { id: "nativity", t: "The Stable", m: "Watercolor", size: "", c: "watercolor", p: 95, img: "nativity.jpg", a: "Nativity scene with Mary, Joseph, shepherds, a donkey and an ox" },
    { id: "seashells", t: "Seashells", m: "Colored pencil and watercolor, framed", size: "", c: "framed", p: 140, img: "seashells.jpg", a: "Scallop, moon snail and clam shells with driftwood on sand" },
    { id: "sunflower", t: "Black-Eyed Susan", m: "Acrylic on paper, in a carved wood frame", size: "", c: "framed", p: 65, img: "sunflower.jpg", a: "Yellow flower with brown leaves in a dark wood frame" },
    { id: "hedgehog", t: "Hedgehog with Lavender", m: "Small watercolor", size: "", c: "little", p: 35, img: "hedgehog.jpg", a: "Hedgehog holding a bunch of lavender by a yellow door" },
    { id: "mouse", t: "Mrs. Mouse Goes Visiting", m: "Small watercolor", size: "", c: "little", p: 35, img: "mouse.jpg", a: "Mouse in a yellow dress carrying a basket and a teacup" },
    { id: "cottage", t: "Ivy Cottage", m: "Small watercolor", size: "", c: "little", p: 35, img: "cottage.jpg", a: "White cottage with a yellow door, roses and ivy" },
    { id: "mushrooms", t: "Mushroom Basket", m: "Small watercolor", size: "", c: "little", p: 35, img: "mushrooms.jpg", a: "Woven basket of mushrooms and wildflowers in grass" }
  ].map(x => ({ ...x, sold: false, hidden: false }))
}
