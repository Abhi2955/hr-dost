const mongoose = require('mongoose');

const onboardingFlowSchema = new mongoose.Schema({
  orgId: { type: String, required: true, unique: true },
  flow: { type: Object, required: true },
});

const OnboardingFlow =
  mongoose.models.OnboardingFlow ||
  mongoose.model('OnboardingFlow', onboardingFlowSchema);

const onboardingUserStateSchema = new mongoose.Schema({
  orgId: { type: String, required: true },
  userId: { type: String, required: true },
  state: { type: Object, required: true },
});

onboardingUserStateSchema.index({ orgId: 1, userId: 1 }, { unique: true });

const OnboardingUserState =
  mongoose.models.OnboardingUserState ||
  mongoose.model('OnboardingUserState', onboardingUserStateSchema);

async function getFlow(orgId) {
  return OnboardingFlow.findOne({ orgId });
}

async function saveFlow(orgId, flow) {
  return OnboardingFlow.findOneAndUpdate(
    { orgId },
    { flow },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function getUserState(orgId, userId) {
  return OnboardingUserState.findOne({ orgId, userId });
}

async function saveUserState(orgId, userId, state) {
  return OnboardingUserState.findOneAndUpdate(
    { orgId, userId },
    { state },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

module.exports = {
  getFlow,
  saveFlow,
  getUserState,
  saveUserState,
  OnboardingFlow,
  OnboardingUserState,
};

