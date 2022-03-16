import { readFileSync } from 'fs';
import { MemoryAdapter, newEnforcer, newModelFromString } from 'casbin';

const basicModelExample = 'src/__test__/examples/basic_model.conf';
export const basicModelStr = readFileSync(basicModelExample).toString();
const basicPolicyExample = 'src/__test__/examples/basic_policy.csv';
export const basicPolicyStr = readFileSync(basicPolicyExample).toString();

const rbacModelExample = 'src/__test__/examples/rbac_model.conf';
export const rbacModelStr = readFileSync(rbacModelExample).toString();
const rbacPolicyExample = 'src/__test__/examples/rbac_policy.csv';
export const rbacPolicyStr = readFileSync(rbacPolicyExample).toString();

const abacWithObjRuleModelExample = 'src/__test__/examples/abac_with_obj_rule_policy.csv';
export const abacWithObjRuleModelStr = readFileSync(abacWithObjRuleModelExample).toString();

export function getEnforcer() {
    return newEnforcer(newModelFromString(basicModelStr), new MemoryAdapter(basicModelStr));
}
