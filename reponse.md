seance 4 
Q1:
Avec Material UI, je n’ai pas écrit de fichier CSS séparé (0 lignes), seulement quelques styles avec sx.
Contrairement à Header.module.css où plusieurs dizaines de lignes sont nécessaires pour gérer le layout, les couleurs et le responsive.
Q2:
Dans ce cas précis, je considère que le HeaderBS (Bootstrap) est plus lisible et plus court. La syntaxe Bootstrap est plus directe pour créer une barre de navigation, tandis que Material-UI offre plus de contrôle stylistique au prix d'une complexité accrue. Pour un projet simple, Bootstrap serait mon choix privilégié.
Q3:
MUI : sx={{}} = CSS-in-JS (styles inline, théming intégré, responsive automatique)
Bootstrap : className="" + style={{}} = Classes utilitaires + styles inline quand nécessaires
Q4:
