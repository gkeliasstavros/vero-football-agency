# VERO AI Execution Engine v1.0 — isolated staging prototype

Repository main is the **public VERO website** linked to Hostinger. DO NOT merge this branch or place operational credentials in this public repository.

## Verified scope
Offline single-process workflow transport for SPORT-NEED-001: Sporting Strategy → Scouting → Club Relations. HMAC-signed per-stage receipts, deterministic job ID, duplicate suppression within a single run, no external network calls, no AI execution. This does **not** prove independent agent receipt.

## Run locally
```bash
export VERO_STAGING_SIGNING_KEY='locally-generated-random-secret-at-least-16-characters'
cd engine_staging
python -m unittest -v
python engine.py --fixture fixture.json --out local-evidence.json
```
Never commit generated receipts containing real information or keys.

## Production integration still missing
Dedicated **private** repository / hosting; service credentials in a secrets manager; service-specific workers and independent acknowledgments; database API adapter with least-privilege access; durable transactional queue/ledger and replay protection across runs; a dedicated identity/role service; real output schema validation; source links; audit log durability; monitoring/retries/dead-letter queue; CEO authorization enforced at action boundary; explicit approval before external communication. Never infer a real club mandate from a provisional claim.

## Constraints
Only internally verified requirement ID syntax is accepted; any January mandate remains NOT VERIFIED until fresh source-backed evidence exists. Do not connect to website/contact.php or production Drive automatically.
