# GYMPASS API 

GYMPASS Style app.

## Functional Requirements

- [ ] it should be possible to sign up;
- [ ] it should be possible to sign in;
- [ ] it should be possible to get the logged user's profile;
- [ ] it should be possible to get the logged user's check-ins number;
- [ ] it should be possible to get the history of check-ins;
- [ ] it should be possible to get the nearby gyms;
- [ ] it should be possible to get the gyms by name;
- [ ] it should be possible to check-in to a gym;
- [ ] it should be possible to accept an user's check-in;
- [ ] it should be possible to register a gym;

## Business Rules

- [ ] an user can't register with an already used email;
- [ ] an user can't check-in twice in same day;
- [ ] users can't check-in if they are more than 100 meters away from a gym; 
- [ ] a check-in can only be accepted if it has at maximum 20 minutes it was created;
- [ ] a check-in can only be accepted by administrator
- [ ] only administrator can register a gym

## Not Functional Requirements

- [ ] user's password must be encrypted;
- [ ] app data must be persisted on a PostgreSQL database;
- [ ] all get routes must be paginated with 20 items per page;
- [ ] a user must be identified by a JWT (JSON Web Token);

