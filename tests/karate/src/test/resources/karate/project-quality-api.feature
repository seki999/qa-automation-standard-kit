Feature: Project quality management API

  Background:
    * url baseUrl

  Scenario: Create project, test case, result, and verify dashboard
    Given path '/api/projects'
    And request { name: 'Karate Project', owner: 'API QA', startDate: '2026-07-01' }
    When method post
    Then status 200
    And match response.name == 'Karate Project'
    * def projectId = response.id

    Given path '/api/projects'
    When method get
    Then status 200
    And match response[*].name contains 'Karate Project'

    Given path '/api/test-cases'
    And request { projectId: '#(projectId)', title: 'Karate API creates test case', priority: 'High', status: 'NOT_STARTED' }
    When method post
    Then status 200
    And match response.projectId == projectId
    * def testCaseId = response.id

    Given path '/api/test-results'
    And request { testCaseId: '#(testCaseId)', status: 'PASSED', executedBy: 'karate', note: 'API regression passed' }
    When method post
    Then status 200
    And match response.status == 'PASSED'

    Given path '/api/test-cases'
    When method get
    Then status 200
    * def createdTestCases = karate.filter(response, function(testCase){ return testCase.id == testCaseId })
    And match createdTestCases[0].status == 'PASSED'

    Given path '/api/dashboard'
    When method get
    Then status 200
    And assert response.totalTestCases >= 1
    And assert response.passed >= 1
