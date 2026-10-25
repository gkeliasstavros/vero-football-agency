"""VERO v1 staging-only deterministic coordination harness. No network or AI calls."""
import argparse, hashlib, hmac, json, os
from pathlib import Path

REQUIRED = ('requirement_id', 'club', 'role', 'evidence_class')
ALLOWED = {'SPORT-NEED-%03d' % i for i in range(1, 9)}

def digest(payload):
    return hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

def run(data, secret, ledger=None):
    if not secret or len(secret) < 16:
        raise ValueError('Staging signing key must have >=16 characters')
    events = []
    seen = set(ledger or [])
    requirements = data.get('requirements')
    if not isinstance(requirements, list):
        raise ValueError('requirements must be a list')
    for item in requirements:
        if not isinstance(item, dict) or any(not item.get(k) for k in REQUIRED):
            raise ValueError('Missing required requirement fields')
        key = item['requirement_id']
        if key not in ALLOWED:
            raise ValueError('Unregistered requirement ID: ' + str(key))
        if item['evidence_class'] not in ('CLAIM','INFERENCE','UNKNOWN','VERIFIED FACT'):
            raise ValueError('Unsupported evidence class')
        jobid = 'JOB-' + digest(item)[:16]
        if jobid in seen:
            continue
        seen.add(jobid)
        sporting = {'job_id':jobid,'stage':'SPORTING','status':'PUBLISHED_FOR_INTERNAL_RESEARCH','requirement_id':key,'source_evidence':item.get('source_evidence') or 'NONE','current_mandate_verified':False}
        scouting = {'job_id':jobid,'stage':'SCOUTING','status':'RECEIVED_FOR_RESEARCH_ONLY','requirement_id':key,'qualification_authorized':False}
        club_relations = {'job_id':jobid,'stage':'CLUB_RELATIONS','status':'RECEIVED_FOR_INTERNAL_VERIFICATION','requirement_id':key,'external_contact_authorized':False}
        for receipt in (sporting,scouting,club_relations):
            msg=json.dumps(receipt,sort_keys=True,separators=(',',':')).encode()
            receipt['hmac_sha256']=hmac.new(secret.encode(),msg,hashlib.sha256).hexdigest()
            receipt['execution_identity']='SINGLE_PROCESS_STAGING_HARNESS'
            events.append(receipt)
    return {'environment':'OFFLINE_STAGING_ONLY','independent_agents_deployed':False,'external_actions_enabled':False,'events':events,'processed_jobs':len(seen)}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--fixture',required=True)
    parser.add_argument('--out',required=True)
    args=parser.parse_args()
    source=json.loads(Path(args.fixture).read_text())
    result=run(source,os.environ.get('VERO_STAGING_SIGNING_KEY',''))
    target=Path(args.out)
    if target.exists():
        raise SystemExit('Refusing to overwrite existing run evidence')
    target.write_text(json.dumps(result,indent=2)+'\n')
    print('staging harness passed:',len(result['events']),'signed internal receipts')

if __name__=='__main__':
    main()
