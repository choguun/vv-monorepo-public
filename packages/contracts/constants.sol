// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

uint256 constant SEASON_PASS_STARTING_PRICE = 0.03 ether;
uint256 constant SEASON_PASS_MIN_PRICE = 0.03 ether;
uint256 constant SEASON_PASS_PRICE_DECREASE_PER_SECOND = 0;
uint256 constant SEASON_PASS_PRICE_DECREASE_DENOMINATOR = 10_000_000_000;
uint256 constant SEASON_PASS_PURCHASE_MULTIPLIER_PERCENT = 100;
uint256 constant SEASON_START_TIME = 1714579200;
uint256 constant SEASON_PASS_MINT_DURATION = 3 days;
uint256 constant SEASON_DURATION = 30 days;
uint256 constant SEASON_PASS_PRIVATE_MATCH_LIMIT = 30;

uint256 constant COST_CREATE_MATCH = 100 ether;
uint256 constant MATCHES_PER_DAY_HARD_CAP = 2000;

uint256 constant WINDOW = 604800; // number of seconds in a week
uint256 constant SKYPOOL_SUPPLY = 100_000_000 ether; // tokens in Sky Pool

uint256 constant SKY_KEY_TOKEN_ID = 0;

bytes14 constant SEASON_PASS_NAMESPACE = "Season2";
string constant SEASON_PASS_SYMBOL = unicode"🎫-2";
string constant SEASON_PASS_NAME = "Season Pass (Season 2)";

bytes14 constant ORB_NAMESPACE = "Orb";
bytes14 constant SKY_KEY_NAMESPACE = "SkyKey";

uint16 constant MAX_HP = 100;
uint32 constant MAX_STAMINA = 1000;

uint256 constant POTION_PRICE = 1000;
uint32 constant POTION_STAMINA = 300;

uint256 constant POINT_DAILY_LOG_IN = 20;
uint256 constant POINT_DAILY_CHECK_IN = 20;
uint256 constant POINT_GATHER_RESOURCE = 50;
uint256 constant POINT_COMMON_RESOURCE = 50;
uint256 constant POINT_RARE_RESOURCE = 100;
uint256 constant POINT_MYSTICAL_RESOURCE = 1000;
uint256 constant POINT_ARTIFACT_RESOURCE = 2000;
uint256 constant POINT_GOD_RESOURCE = 0;

uint256 constant POINT_CONFIRM_CHECK_IN = 500;
uint256 constant POINT_CONFIRM_LOG_IN = 500;
uint256 constant POINT_CONFIRM_GATHER_RESOURCE = 1000;
uint256 constant POINT_CONFIRM_COMMON_RESOURCE = 1000;
uint256 constant POINT_CONFIRM_RARE_RESOURCE = 1500;
uint256 constant POINT_CONFIRM_MYSTICAL_RESOURCE = 2000;
uint256 constant POINT_CONFIRM_ARTIFACT_RESOURCE = 5000;
uint256 constant POINT_CONFIRM_GOD_RESOURCE = 0;