import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let lastTokenId = 0;
const tokenMetadata = new Map();
const tokenOwners = new Map();

// Simulated contract functions
function mintSpecies(name: string, description: string, universeId: number, rarity: number, imageUrl: string, creator: string) {
  const tokenId = ++lastTokenId;
  tokenMetadata.set(tokenId, {
    creator,
    name,
    description,
    universeId,
    rarity,
    discoveryTime: Date.now(),
    imageUrl
  });
  tokenOwners.set(tokenId, creator);
  return tokenId;
}

function transferSpecies(tokenId: number, sender: string, recipient: string) {
  if (tokenOwners.get(tokenId) !== sender) throw new Error('Not authorized');
  tokenOwners.set(tokenId, recipient);
  return true;
}

describe('Multiverse Species NFT Contract', () => {
  beforeEach(() => {
    lastTokenId = 0;
    tokenMetadata.clear();
    tokenOwners.clear();
  });
  
  it('should mint a new multiverse species NFT', () => {
    const id = mintSpecies('Luminous Floater', 'A bioluminescent floating creature', 5, 8, 'https://example.com/luminous-floater.jpg', 'discoverer1');
    expect(id).toBe(1);
    const metadata = tokenMetadata.get(id);
    expect(metadata.name).toBe('Luminous Floater');
    expect(metadata.universeId).toBe(5);
    expect(metadata.rarity).toBe(8);
    expect(tokenOwners.get(id)).toBe('discoverer1');
  });
  
  it('should transfer multiverse species NFT ownership', () => {
    const id = mintSpecies('Quantum Shifter', 'A creature that exists in multiple states simultaneously', 7, 10, 'https://example.com/quantum-shifter.gif', 'discoverer2');
    expect(transferSpecies(id, 'discoverer2', 'collector1')).toBe(true);
    expect(tokenOwners.get(id)).toBe('collector1');
  });
  
  it('should not allow unauthorized transfers', () => {
    const id = mintSpecies('Chronovore', 'A being that feeds on temporal energy', 3, 9, 'https://example.com/chronovore.png', 'discoverer3');
    expect(() => transferSpecies(id, 'unauthorized_user', 'collector2')).toThrow('Not authorized');
  });
});

