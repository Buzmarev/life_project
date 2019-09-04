<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class GameLifeController extends AbstractController
{
    /**
     * @Route("/game/life", name="game_life")
     */
    public function index()
    {
        return $this->render('game_life/index.html.twig', [
            'controller_name' => 'GameLifeController',
        ]);
    }
}
