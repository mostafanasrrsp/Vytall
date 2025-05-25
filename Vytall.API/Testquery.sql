USE MedConnectDB; 

SELECT * FROM Appointments;

ALTER TABLE Prescriptions ADD FirstDoseTime datetime NULL;
ALTER TABLE Prescriptions ADD LastTakenTime datetime NULL;
ALTER TABLE Prescriptions ADD MissedDoses int NOT NULL DEFAULT 0;
ALTER TABLE Prescriptions ADD AllowEarlyDose bit NOT NULL DEFAULT 0;
ALTER TABLE Prescriptions ADD EarlyDoseThresholdMinutes int NOT NULL DEFAULT 30;