import unittest
from engine import run
SECRET='local-test-signing-key-not-production'
ITEM={'requirement_id':'SPORT-NEED-001','club':'Gintra','role':'Winger','evidence_class':'CLAIM'}
class EngineTest(unittest.TestCase):
    def test_full_chain(self):
        result=run({'requirements':[ITEM]},SECRET)
        self.assertEqual([x['stage'] for x in result['events']],['SPORTING','SCOUTING','CLUB_RELATIONS'])
        self.assertTrue(all(x['hmac_sha256'] for x in result['events']))
        self.assertFalse(result['external_actions_enabled'])
        self.assertFalse(result['independent_agents_deployed'])
    def test_idempotent_repeated_fixture(self):
        self.assertEqual(len(run({'requirements':[ITEM,ITEM]},SECRET)['events']),3)
    def test_invalid_id_rejected(self):
        with self.assertRaises(ValueError):run({'requirements':[dict(ITEM,requirement_id='SPORT-NEED-099')]},SECRET)
    def test_missing_key_rejected(self):
        with self.assertRaises(ValueError):run({'requirements':[ITEM]},'bad')
    def test_missing_evidence_class_rejected(self):
        with self.assertRaises(ValueError):run({'requirements':[dict(ITEM,evidence_class='')]},SECRET)
if __name__=='__main__': unittest.main()
