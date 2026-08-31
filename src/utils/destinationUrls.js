export function slugifyDestinationName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function destinationUrlSlug(destination) {
  if (destination?.slug === 'republique-democratique-du-congo') {
    return 'democratic-republic-of-the-congo'
  }
  return slugifyDestinationName(destination?.names?.en || destination?.name || destination?.slug)
}

export function findDestinationByUrlSlug(destinations, slug) {
  return destinations.find((destination) =>
    destinationUrlSlug(destination) === slug || destination.slug === slug
  ) || null
}
