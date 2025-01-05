import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let modelCount = 0;
let interactionCount = 0;
const ecosystemModels = new Map();
const ecosystemInteractions = new Map();

// Simulated contract functions
function createEcosystemModel(name: string, description: string, universeId: number, complexity: number, creator: string) {
  const modelId = ++modelCount;
  ecosystemModels.set(modelId, {
    creator,
    name,
    description,
    universeId,
    complexity,
    creationTime: Date.now(),
    lastUpdate: Date.now()
  });
  return modelId;
}

function updateEcosystemModel(modelId: number, description: string, complexity: number, updater: string) {
  const model = ecosystemModels.get(modelId);
  if (!model) throw new Error('Invalid model');
  if (model.creator !== updater) throw new Error('Not authorized');
  model.description = description;
  model.complexity = complexity;
  model.lastUpdate = Date.now();
  ecosystemModels.set(modelId, model);
  return true;
}

function recordEcosystemInteraction(modelId: number, action: string, impact: number, interactor: string) {
  if (!ecosystemModels.has(modelId)) throw new Error('Invalid model');
  const interactionId = ++interactionCount;
  ecosystemInteractions.set(interactionId, {
    modelId,
    interactor,
    action,
    impact,
    timestamp: Date.now()
  });
  return interactionId;
}

describe('Ecosystem Management Contract', () => {
  beforeEach(() => {
    modelCount = 0;
    interactionCount = 0;
    ecosystemModels.clear();
    ecosystemInteractions.clear();
  });
  
  it('should create a new ecosystem model', () => {
    const id = createEcosystemModel('Aquatic Biome', 'A complex aquatic ecosystem', 1, 8, 'researcher1');
    expect(id).toBe(1);
    const model = ecosystemModels.get(id);
    expect(model.name).toBe('Aquatic Biome');
    expect(model.universeId).toBe(1);
    expect(model.complexity).toBe(8);
  });
  
  it('should update an existing ecosystem model', () => {
    const id = createEcosystemModel('Forest Biome', 'A temperate forest ecosystem', 2, 7, 'researcher2');
    expect(updateEcosystemModel(id, 'An updated temperate forest ecosystem', 8, 'researcher2')).toBe(true);
    const updatedModel = ecosystemModels.get(id);
    expect(updatedModel.description).toBe('An updated temperate forest ecosystem');
    expect(updatedModel.complexity).toBe(8);
  });
  
  it('should record an ecosystem interaction', () => {
    const modelId = createEcosystemModel('Coral Reef', 'A diverse coral reef ecosystem', 3, 9, 'researcher3');
    const interactionId = recordEcosystemInteraction(modelId, 'Introduce new species', 5, 'researcher4');
    expect(interactionId).toBe(1);
    const interaction = ecosystemInteractions.get(interactionId);
    expect(interaction.modelId).toBe(modelId);
    expect(interaction.action).toBe('Introduce new species');
    expect(interaction.impact).toBe(5);
  });
  
  it('should not allow unauthorized updates', () => {
    const id = createEcosystemModel('Tundra', 'A cold tundra ecosystem', 4, 6, 'researcher5');
    expect(() => updateEcosystemModel(id, 'Unauthorized update', 7, 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should not allow interactions with invalid models', () => {
    expect(() => recordEcosystemInteraction(999, 'Invalid action', 0, 'researcher6')).toThrow('Invalid model');
  });
});

